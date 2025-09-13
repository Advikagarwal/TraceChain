const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying AgriTrust contract...");

  // Get the contract factory
  const AgriTrust = await ethers.getContractFactory("AgriTrust");

  // Deploy the contract
  const agriTrust = await AgriTrust.deploy();
  await agriTrust.waitForDeployment();

  const contractAddress = await agriTrust.getAddress();
  console.log("AgriTrust deployed to:", contractAddress);

  // Verify deployment
  console.log("Verifying deployment...");
  const owner = await agriTrust.owner();
  console.log("Contract owner:", owner);

  const name = await agriTrust.name();
  const symbol = await agriTrust.symbol();
  console.log("Token name:", name);
  console.log("Token symbol:", symbol);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: network.name,
    deployer: owner,
    deploymentTime: new Date().toISOString(),
    contractName: "AgriTrust",
    tokenName: name,
    tokenSymbol: symbol,
  };

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file for frontend use
  const fs = require("fs");
  const path = require("path");
  
  const deploymentPath = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(deploymentPath, `${network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(`\nDeployment info saved to: deployments/${network.name}.json`);
  
  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });