// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title TraceChain
 * @dev NFT contract for agricultural supply chain tracking with quality and fairness verification
 */
contract TraceChain is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Events
    event BatchMinted(uint256 indexed tokenId, address indexed producer, string batchId);
    event QualityAssessed(uint256 indexed tokenId, uint256 qualityScore, uint256 timestamp);
    event FairnessAssessed(uint256 indexed tokenId, uint256 fairnessScore, uint256 timestamp);
    event StageUpdated(uint256 indexed tokenId, string stage, uint256 timestamp);
    event ProducerVerified(address indexed producer, uint256 timestamp);
    
    // Structs
    struct BatchInfo {
        string batchId;
        address producer;
        string productType;
        uint256 quantity;
        uint256 harvestDate;
        string location;
        uint256 qualityScore;
        uint256 fairnessScore;
        string currentStage;
        bool isActive;
        uint256 createdAt;
    }
    
    struct ProducerInfo {
        string name;
        string location;
        bool isVerified;
        uint256 totalBatches;
        uint256 averageQuality;
        uint256 averageFairness;
        uint256 registrationDate;
    }
    
    struct SupplyChainEvent {
        string stage;
        uint256 timestamp;
        string location;
        string actor;
        string description;
        bool verified;
    }
    
    // Mappings
    mapping(uint256 => BatchInfo) public batches;
    mapping(address => ProducerInfo) public producers;
    mapping(uint256 => SupplyChainEvent[]) public supplyChainEvents;
    mapping(string => uint256) public batchIdToTokenId;
    mapping(address => bool) public authorizedOracles;
    
    // Modifiers
    modifier onlyAuthorizedOracle() {
        require(authorizedOracles[msg.sender] || msg.sender == owner(), "Not authorized oracle");
        _;
    }
    
    modifier onlyProducer(uint256 tokenId) {
        require(batches[tokenId].producer == msg.sender, "Not the producer of this batch");
        _;
    }
    
    modifier validTokenId(uint256 tokenId) {
        require(_exists(tokenId), "Token does not exist");
        _;
    }
    
    constructor() ERC721("TraceChain", "TRACE") {}
    
    /**
     * @dev Register a new producer
     */
    function registerProducer(
        string memory name,
        string memory location
    ) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(producers[msg.sender].registrationDate == 0, "Producer already registered");
        
        producers[msg.sender] = ProducerInfo({
            name: name,
            location: location,
            isVerified: false,
            totalBatches: 0,
            averageQuality: 0,
            averageFairness: 0,
            registrationDate: block.timestamp
        });
    }
    
    /**
     * @dev Verify a producer (only owner)
     */
    function verifyProducer(address producer) external onlyOwner {
        require(producers[producer].registrationDate > 0, "Producer not registered");
        producers[producer].isVerified = true;
        emit ProducerVerified(producer, block.timestamp);
    }
    
    /**
     * @dev Mint a new batch NFT
     */
    function mintBatch(
        string memory batchId,
        string memory productType,
        uint256 quantity,
        uint256 harvestDate,
        string memory location,
        string memory tokenURI
    ) external returns (uint256) {
        require(producers[msg.sender].isVerified, "Producer not verified");
        require(bytes(batchId).length > 0, "Batch ID cannot be empty");
        require(batchIdToTokenId[batchId] == 0, "Batch ID already exists");
        require(quantity > 0, "Quantity must be greater than 0");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        batches[tokenId] = BatchInfo({
            batchId: batchId,
            producer: msg.sender,
            productType: productType,
            quantity: quantity,
            harvestDate: harvestDate,
            location: location,
            qualityScore: 0,
            fairnessScore: 0,
            currentStage: "harvested",
            isActive: true,
            createdAt: block.timestamp
        });
        
        batchIdToTokenId[batchId] = tokenId;
        producers[msg.sender].totalBatches++;
        
        // Add initial supply chain event
        supplyChainEvents[tokenId].push(SupplyChainEvent({
            stage: "harvested",
            timestamp: block.timestamp,
            location: location,
            actor: producers[msg.sender].name,
            description: string(abi.encodePacked("Batch ", batchId, " harvested")),
            verified: true
        }));
        
        emit BatchMinted(tokenId, msg.sender, batchId);
        return tokenId;
    }
    
    /**
     * @dev Update quality score (only authorized oracles)
     */
    function updateQualityScore(
        uint256 tokenId,
        uint256 qualityScore
    ) external onlyAuthorizedOracle validTokenId(tokenId) {
        require(qualityScore <= 100, "Quality score must be <= 100");
        
        BatchInfo storage batch = batches[tokenId];
        batch.qualityScore = qualityScore;
        
        // Update producer's average quality
        _updateProducerAverages(batch.producer);
        
        emit QualityAssessed(tokenId, qualityScore, block.timestamp);
    }
    
    /**
     * @dev Update fairness score (only authorized oracles)
     */
    function updateFairnessScore(
        uint256 tokenId,
        uint256 fairnessScore
    ) external onlyAuthorizedOracle validTokenId(tokenId) {
        require(fairnessScore <= 100, "Fairness score must be <= 100");
        
        BatchInfo storage batch = batches[tokenId];
        batch.fairnessScore = fairnessScore;
        
        // Update producer's average fairness
        _updateProducerAverages(batch.producer);
        
        emit FairnessAssessed(tokenId, fairnessScore, block.timestamp);
    }
    
    /**
     * @dev Update supply chain stage
     */
    function updateStage(
        uint256 tokenId,
        string memory stage,
        string memory location,
        string memory actor,
        string memory description
    ) external validTokenId(tokenId) {
        BatchInfo storage batch = batches[tokenId];
        require(
            msg.sender == batch.producer || authorizedOracles[msg.sender] || msg.sender == owner(),
            "Not authorized to update stage"
        );
        
        batch.currentStage = stage;
        
        supplyChainEvents[tokenId].push(SupplyChainEvent({
            stage: stage,
            timestamp: block.timestamp,
            location: location,
            actor: actor,
            description: description,
            verified: authorizedOracles[msg.sender] || msg.sender == owner()
        }));
        
        emit StageUpdated(tokenId, stage, block.timestamp);
    }
    
    /**
     * @dev Add authorized oracle
     */
    function addAuthorizedOracle(address oracle) external onlyOwner {
        authorizedOracles[oracle] = true;
    }
    
    /**
     * @dev Remove authorized oracle
     */
    function removeAuthorizedOracle(address oracle) external onlyOwner {
        authorizedOracles[oracle] = false;
    }
    
    /**
     * @dev Get batch information
     */
    function getBatchInfo(uint256 tokenId) external view validTokenId(tokenId) returns (BatchInfo memory) {
        return batches[tokenId];
    }
    
    /**
     * @dev Get supply chain events for a batch
     */
    function getSupplyChainEvents(uint256 tokenId) external view validTokenId(tokenId) returns (SupplyChainEvent[] memory) {
        return supplyChainEvents[tokenId];
    }
    
    /**
     * @dev Get producer information
     */
    function getProducerInfo(address producer) external view returns (ProducerInfo memory) {
        return producers[producer];
    }
    
    /**
     * @dev Get token ID by batch ID
     */
    function getTokenIdByBatchId(string memory batchId) external view returns (uint256) {
        uint256 tokenId = batchIdToTokenId[batchId];
        require(tokenId > 0, "Batch ID not found");
        return tokenId;
    }
    
    /**
     * @dev Get total number of tokens
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Internal function to update producer averages
     */
    function _updateProducerAverages(address producer) internal {
        ProducerInfo storage producerInfo = producers[producer];
        uint256 totalQuality = 0;
        uint256 totalFairness = 0;
        uint256 count = 0;
        
        // Calculate averages across all producer's batches
        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            if (batches[i].producer == producer && batches[i].isActive) {
                totalQuality += batches[i].qualityScore;
                totalFairness += batches[i].fairnessScore;
                count++;
            }
        }
        
        if (count > 0) {
            producerInfo.averageQuality = totalQuality / count;
            producerInfo.averageFairness = totalFairness / count;
        }
    }
    
    /**
     * @dev Override required by Solidity
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    /**
     * @dev Override required by Solidity
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override required by Solidity
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}