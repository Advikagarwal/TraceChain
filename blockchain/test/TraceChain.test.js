const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TraceChain", function () {
  let TraceChain;
  let traceChain;
  let owner;
  let producer;
  let oracle;
  let addr1;

  beforeEach(async function () {
    [owner, producer, oracle, addr1] = await ethers.getSigners();
    
    TraceChain = await ethers.getContractFactory("TraceChain");
    traceChain = await TraceChain.deploy();
    await traceChain.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await traceChain.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await traceChain.name()).to.equal("TraceChain");
      expect(await traceChain.symbol()).to.equal("TRACE");
    });
  });

  describe("Producer Registration", function () {
    it("Should register a producer", async function () {
      await traceChain.connect(producer).registerProducer("Green Valley Farm", "California, USA");
      
      const producerInfo = await traceChain.getProducerInfo(producer.address);
      expect(producerInfo.name).to.equal("Green Valley Farm");
      expect(producerInfo.location).to.equal("California, USA");
      expect(producerInfo.isVerified).to.equal(false);
    });

    it("Should not allow duplicate registration", async function () {
      await traceChain.connect(producer).registerProducer("Green Valley Farm", "California, USA");
      
      await expect(
        traceChain.connect(producer).registerProducer("Another Farm", "Oregon, USA")
      ).to.be.revertedWith("Producer already registered");
    });
  });

  describe("Producer Verification", function () {
    beforeEach(async function () {
      await traceChain.connect(producer).registerProducer("Green Valley Farm", "California, USA");
    });

    it("Should verify a producer", async function () {
      await traceChain.verifyProducer(producer.address);
      
      const producerInfo = await traceChain.getProducerInfo(producer.address);
      expect(producerInfo.isVerified).to.equal(true);
    });

    it("Should only allow owner to verify", async function () {
      await expect(
        traceChain.connect(addr1).verifyProducer(producer.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Batch Minting", function () {
    beforeEach(async function () {
      await traceChain.connect(producer).registerProducer("Green Valley Farm", "California, USA");
      await traceChain.verifyProducer(producer.address);
    });

    it("Should mint a batch NFT", async function () {
      const batchId = "B001";
      const productType = "Organic Tomatoes";
      const quantity = 500;
      const harvestDate = Math.floor(Date.now() / 1000);
      const location = "Green Valley Farm";
      const tokenURI = "https://api.tracechain.com/metadata/B001";

      await expect(
        traceChain.connect(producer).mintBatch(
          batchId,
          productType,
          quantity,
          harvestDate,
          location,
          tokenURI
        )
      ).to.emit(traceChain, "BatchMinted");

      const tokenId = await traceChain.batchIdToTokenId(batchId);
      expect(tokenId).to.equal(1);

      const batchInfo = await traceChain.getBatchInfo(tokenId);
      expect(batchInfo.batchId).to.equal(batchId);
      expect(batchInfo.producer).to.equal(producer.address);
      expect(batchInfo.productType).to.equal(productType);
    });

    it("Should not allow unverified producer to mint", async function () {
      await traceChain.connect(addr1).registerProducer("Unverified Farm", "Texas, USA");
      
      await expect(
        traceChain.connect(addr1).mintBatch(
          "B002",
          "Tomatoes",
          100,
          Math.floor(Date.now() / 1000),
          "Texas",
          "uri"
        )
      ).to.be.revertedWith("Producer not verified");
    });
  });

  describe("Quality and Fairness Scoring", function () {
    let tokenId;

    beforeEach(async function () {
      await traceChain.connect(producer).registerProducer("Green Valley Farm", "California, USA");
      await traceChain.verifyProducer(producer.address);
      await traceChain.addAuthorizedOracle(oracle.address);
      
      await traceChain.connect(producer).mintBatch(
        "B001",
        "Organic Tomatoes",
        500,
        Math.floor(Date.now() / 1000),
        "Green Valley Farm",
        "uri"
      );
      
      tokenId = await traceChain.batchIdToTokenId("B001");
    });

    it("Should update quality score", async function () {
      await expect(
        traceChain.connect(oracle).updateQualityScore(tokenId, 85)
      ).to.emit(traceChain, "QualityAssessed");

      const batchInfo = await traceChain.getBatchInfo(tokenId);
      expect(batchInfo.qualityScore).to.equal(85);
    });

    it("Should update fairness score", async function () {
      await expect(
        traceChain.connect(oracle).updateFairnessScore(tokenId, 90)
      ).to.emit(traceChain, "FairnessAssessed");

      const batchInfo = await traceChain.getBatchInfo(tokenId);
      expect(batchInfo.fairnessScore).to.equal(90);
    });

    it("Should only allow authorized oracles to update scores", async function () {
      await expect(
        traceChain.connect(addr1).updateQualityScore(tokenId, 85)
      ).to.be.revertedWith("Not authorized oracle");
    });
  });

  describe("Supply Chain Updates", function () {
    let tokenId;

    beforeEach(async function () {
      await traceChain.connect(producer).registerProducer("Green Valley Farm", "California, USA");
      await traceChain.verifyProducer(producer.address);
      
      await traceChain.connect(producer).mintBatch(
        "B001",
        "Organic Tomatoes",
        500,
        Math.floor(Date.now() / 1000),
        "Green Valley Farm",
        "uri"
      );
      
      tokenId = await traceChain.batchIdToTokenId("B001");
    });

    it("Should update supply chain stage", async function () {
      await expect(
        traceChain.connect(producer).updateStage(
          tokenId,
          "processed",
          "Processing Center",
          "Processor",
          "Batch processed and packaged"
        )
      ).to.emit(traceChain, "StageUpdated");

      const batchInfo = await traceChain.getBatchInfo(tokenId);
      expect(batchInfo.currentStage).to.equal("processed");
    });

    it("Should store supply chain events", async function () {
      await traceChain.connect(producer).updateStage(
        tokenId,
        "processed",
        "Processing Center",
        "Processor",
        "Batch processed and packaged"
      );

      const events = await traceChain.getSupplyChainEvents(tokenId);
      expect(events.length).to.equal(2); // Initial harvest + new stage
      expect(events[1].stage).to.equal("processed");
    });
  });
});