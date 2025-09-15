import os
import json
from web3 import Web3
from eth_account import Account
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class BlockchainService:
    def __init__(self):
        self.w3 = None
        self.contract = None
        self.account = None
        self._initialize_connection()
    
    def _initialize_connection(self):
        """Initialize Web3 connection and contract"""
        try:
            # Connect to blockchain network
            rpc_url = os.getenv("RPC_URL", "http://localhost:8545")
            self.w3 = Web3(Web3.HTTPProvider(rpc_url))
            
            if not self.w3.is_connected():
                logger.warning("Could not connect to blockchain network")
                return
            
            # Load contract ABI and address
            contract_address = os.getenv("CONTRACT_ADDRESS")
            if contract_address:
                # Load ABI from compiled contract
                abi_path = "../blockchain/artifacts/contracts/TraceChain.sol/TraceChain.json"
                if os.path.exists(abi_path):
                    with open(abi_path, 'r') as f:
                        contract_json = json.load(f)
                        self.contract = self.w3.eth.contract(
                            address=contract_address,
                            abi=contract_json['abi']
                        )
            
            # Load account for transactions
            private_key = os.getenv("PRIVATE_KEY")
            if private_key:
                self.account = Account.from_key(private_key)
                
            logger.info("Blockchain service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize blockchain service: {e}")
    
    async def mint_batch_nft(self, batch_data: Dict[str, Any]) -> Dict[str, Any]:
        """Mint NFT for a batch"""
        try:
            if not self.contract or not self.account:
                # Return mock response for development
                return {
                    "success": True,
                    "token_id": 1001,
                    "transaction_hash": "0x1234567890abcdef",
                    "message": "NFT minted successfully (mock)"
                }
            
            # Prepare transaction data
            batch_id = str(batch_data["_id"])
            product_type = batch_data["product_type"]
            quantity = int(batch_data["quantity"])
            harvest_date = int(batch_data["harvest_date"].timestamp())
            location = batch_data["location"]
            
            # Create metadata URI (would typically be IPFS)
            token_uri = f"https://api.tracechain.com/metadata/{batch_id}"
            
            # Build transaction
            function = self.contract.functions.mintBatch(
                batch_id,
                product_type,
                quantity,
                harvest_date,
                location,
                token_uri
            )
            
            # Estimate gas
            gas_estimate = function.estimate_gas({'from': self.account.address})
            
            # Build transaction
            transaction = function.build_transaction({
                'from': self.account.address,
                'gas': gas_estimate,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.account.address),
            })
            
            # Sign and send transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.account.key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for confirmation
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Extract token ID from logs
            token_id = None
            for log in receipt.logs:
                try:
                    decoded = self.contract.events.BatchMinted().process_log(log)
                    token_id = decoded['args']['tokenId']
                    break
                except:
                    continue
            
            return {
                "success": True,
                "token_id": token_id,
                "transaction_hash": tx_hash.hex(),
                "block_number": receipt.blockNumber,
                "gas_used": receipt.gasUsed
            }
            
        except Exception as e:
            logger.error(f"Failed to mint NFT: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_token_info(self, token_id: int) -> Dict[str, Any]:
        """Get information about a token"""
        try:
            if not self.contract:
                # Return mock data for development
                return {
                    "token_id": token_id,
                    "owner": "0x1234567890123456789012345678901234567890",
                    "batch_info": {
                        "batch_id": f"B{token_id:03d}",
                        "product_type": "Organic Tomatoes",
                        "quantity": 500,
                        "location": "Green Valley Farm"
                    }
                }
            
            # Get token owner
            owner = self.contract.functions.ownerOf(token_id).call()
            
            # Get batch info
            batch_info = self.contract.functions.getBatchInfo(token_id).call()
            
            return {
                "token_id": token_id,
                "owner": owner,
                "batch_info": {
                    "batch_id": batch_info[0],
                    "producer": batch_info[1],
                    "product_type": batch_info[2],
                    "quantity": batch_info[3],
                    "harvest_date": batch_info[4],
                    "location": batch_info[5],
                    "quality_score": batch_info[6],
                    "fairness_score": batch_info[7],
                    "current_stage": batch_info[8],
                    "is_active": batch_info[9],
                    "created_at": batch_info[10]
                }
            }
            
        except Exception as e:
            logger.error(f"Failed to get token info: {e}")
            raise Exception(str(e))
    
    async def verify_transaction(self, tx_hash: str) -> Dict[str, Any]:
        """Verify a blockchain transaction"""
        try:
            if not self.w3:
                return {"verified": False, "error": "Blockchain not connected"}
            
            # Get transaction receipt
            receipt = self.w3.eth.get_transaction_receipt(tx_hash)
            
            return {
                "verified": True,
                "block_number": receipt.blockNumber,
                "gas_used": receipt.gasUsed,
                "status": receipt.status,
                "confirmations": self.w3.eth.block_number - receipt.blockNumber
            }
            
        except Exception as e:
            logger.error(f"Failed to verify transaction: {e}")
            return {"verified": False, "error": str(e)}