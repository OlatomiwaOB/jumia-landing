"use client";

import axiosInstance from "@/utils/fetch-function";
import { useMutation } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function EscrowCheckout() {
  const [status, setStatus] = useState("");
  const [txId, setTxId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Contract & merchant addresses
  const ESCROW_VAULT = "TReeAUnDQakeDSEnAUcp65EubajiQhz8YV";
  const MERCHANT = "TXxPrefBbyktVJmtNqXvcL3xAXn4cFLfez";
  const USDT_CONTRACT = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf"; // Nile testnet USDT
  const USDT_DECIMALS = 1_000_000;
  
  // Fixed ABI - should be an array, not an object with "entrys"
  const ESCROW_ABI = [
    {
      "inputs": [
        {"name": "escrowId", "type": "bytes32"},
        {"name": "payer", "type": "address"},
        {"name": "payee", "type": "address"},
        {"name": "amount", "type": "uint256"},
        {"name": "expiry", "type": "uint256"},
        {"name": "attestRef", "type": "bytes32"}
      ],
      "name": "fund",
      "stateMutability": "Nonpayable",
      "type": "Function"
    },
    {
      "inputs": [
        {"name": "escrowId", "type": "bytes32"},
        {"name": "payee", "type": "address"},
        {"name": "expiry", "type": "uint256"},
        {"name": "attestRef", "type": "bytes32"}
      ],
      "name": "payWithTRX",
      "stateMutability": "Payable",
      "type": "Function"
    },
    {
      "outputs": [
        {"name": "payer", "type": "address"},
        {"name": "payee", "type": "address"},
        {"name": "amount", "type": "uint256"},
        {"name": "released", "type": "bool"},
        {"name": "expiry", "type": "uint256"},
        {"name": "attestRef", "type": "bytes32"}
      ],
      "constant": true,
      "inputs": [{"type": "bytes32"}],
      "name": "escrows",
      "stateMutability": "View",
      "type": "Function"
    }
  ];

  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [tronWeb, setTronWeb] = useState<any>(null);
  
  // Backend API
  const {mutate} = useMutation({
    mutationFn: (data:any)=>axiosInstance.request({
      url: '/chainTransaction/save',
      method: 'POST',
      data: data
    }),
    onSuccess: (data)=>{
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc)
        return
      }
      toast.success(data?.data?.desc||'Order sent')
    }
  })

  useEffect(() => {
    const initTronWeb = async () => {
      if ((window as any).tronWeb && (window as any).tronWeb.ready) {
        const tw = (window as any).tronWeb;

        // Force fullHost to Nile testnet
        tw.setFullNode("https://api.nileex.io");
        tw.setSolidityNode("https://api.nileex.io");
        tw.setEventServer("https://api.nileex.io");

        setTronWeb(tw);
        console.log("TronWeb initialized successfully");
      } else {
        console.warn("TronLink not found. Please install TronLink.");
        setStatus("⚠️ TronLink not found. Please install TronLink extension.");
      }
    };
    initTronWeb();
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);

  // Helper function to wait for transaction confirmation
  const waitForTransaction = useCallback(async (tronWebInstance: any, txId: string): Promise<any> => {
    return new Promise(async (resolve) => {
      let receipt: any = null;
      for (let i = 0; i < 30; i++) {
        try {
          receipt = await tronWebInstance.trx.getTransactionInfo(txId);
          if (receipt && receipt.receipt) {
            resolve(receipt);
            return;
          }
        } catch (error) {
          console.warn(`Attempt ${i + 1} failed:`, error);
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      resolve(receipt);
    });
  }, []);

  // Helper function to approve USDT spending
  const approveUSDT = async (amount: number) => {
    try {
      setStatus("Approving USDT spending...");
      
      // Get USDT contract without ABI (TronWeb will fetch it automatically)
      const usdtContract = await tronWeb.contract().at(USDT_CONTRACT);
      
      const approveResult = await usdtContract.approve(
        ESCROW_VAULT,
        amount
      ).send({
        feeLimit: 50_000_000,
        shouldPollResponse: false
      });
      
      console.log("USDT approval result:", approveResult);
      setStatus("USDT approved. Proceeding with escrow funding...");
      
      return approveResult;
    } catch (error: any) {
      console.error("USDT approval failed:", error);
      throw new Error(`USDT approval failed: ${error.message || error}`);
    }
  };

  const fundEscrow = useCallback(async (isTRC20: boolean) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setStatus("");
    setTxId("");

    try {
      // Validation checks
      if (!tronWeb) {
        throw new Error("TronLink is not initialized. Please make sure TronLink is installed and unlocked.");
      }

      if (!tronWeb.defaultAddress || !tronWeb.defaultAddress.base58) {
        throw new Error("No wallet address found. Please connect your TronLink wallet.");
      }

      const buyer = tronWeb.defaultAddress.base58;
      console.log("Buyer address:", buyer);

      // Check network
      const nodeInfo = await tronWeb.trx.getNodeInfo();
      console.log("Connected to network:", nodeInfo);

      // Generate transaction parameters
      const orderIdStr = checkoutData?.orderNo || `ORDER_${Date.now()}`;
      
      if (!orderIdStr || typeof orderIdStr !== 'string') {
        throw new Error("Invalid order ID. Please refresh and try again.");
      }
      
      console.log("Order ID String:", orderIdStr);
      
      const orderId = tronWeb.sha3(orderIdStr);
      console.log("Hashed Order ID:", orderId);
      
      // Fixed amount calculation
      const amount = isTRC20 ? (2 * USDT_DECIMALS) : (2 * 1_000_000); // 2 USDT or 2 TRX
      const expiry = Math.floor(Date.now() / 1000) + 86400;
      const attestRef = tronWeb.sha3("TXN_REF_" + Date.now());

      console.log("Transaction params:", { orderId, buyer, MERCHANT, amount, expiry, attestRef });

      setStatus("Connecting to contract...");

      // Verify contract exists
      const contractInfo = await tronWeb.trx.getContract(ESCROW_VAULT);
      if (!contractInfo || !contractInfo.contract_address) {
        throw new Error(`Contract not found at address: ${ESCROW_VAULT}`);
      }
      console.log("Contract verified:", contractInfo);

      // Get contract instance - try multiple approaches
      let contract;
      try {
        // Method 1: Try with ABI
        contract = await tronWeb.contract(ESCROW_ABI, ESCROW_VAULT);
        console.log("Contract instance created with ABI");
      } catch (contractError) {
        console.error("Contract creation with ABI failed:", contractError);
        
        try {
          // Method 2: Try without ABI (let TronWeb fetch it)
          contract = await tronWeb.contract().at(ESCROW_VAULT);
          console.log("Contract instance created without ABI");
        } catch (fallbackError) {
          console.error("Contract creation fallback failed:", fallbackError);
          throw new Error(`Failed to connect to contract: ${fallbackError.message || fallbackError}`);
        }
      }

      // Check account balance
      if (isTRC20) {
        try {
          const usdtContract = await tronWeb.contract().at(USDT_CONTRACT);
          const balance = await usdtContract.balanceOf(buyer).call();
          console.log("USDT Balance:", balance.toString());
          
          if (balance < amount) {
            throw new Error(`Insufficient USDT balance. Required: ${amount / USDT_DECIMALS} USDT`);
          }

          // Approve USDT spending first
          await approveUSDT(amount);
        } catch (balanceError: any) {
          console.error("Balance/approval check failed:", balanceError);
          throw new Error(`USDT balance/approval failed: ${balanceError.message || balanceError}`);
        }
      } else {
        const trxBalance = await tronWeb.trx.getBalance(buyer);
        console.log("TRX Balance:", trxBalance);
        
        if (trxBalance < amount) {
          throw new Error(`Insufficient TRX balance. Required: ${amount / 1_000_000} TRX`);
        }
      }

      setStatus("Sending transaction...");

      let tx: string;

      if (isTRC20) {
        console.log("Calling fund method with params:", { orderId, buyer, MERCHANT, amount, expiry, attestRef });
        
        try {
          const result = await contract.fund(
            orderId,
            buyer,
            MERCHANT,
            amount,
            expiry,
            attestRef
          ).send({ 
            feeLimit: 100_000_000,
            shouldPollResponse: false
          });
          tx = result;
          
        } catch (fundError: any) {
          console.error("Fund method error:", fundError);
          throw new Error(`TRC20 payment failed: ${fundError.message || fundError}`);
        }
      } else {
        console.log("Calling payWithTRX method with params:", { orderId, MERCHANT, expiry, attestRef, callValue: amount });
        
        try {
          const result = await contract.payWithTRX(
            orderId,
            MERCHANT,
            expiry,
            attestRef
          ).send({ 
            feeLimit: 100_000_000, 
            callValue: amount,
            shouldPollResponse: false
          });
          tx = result;
          
        } catch (trxError: any) {
          console.error("PayWithTRX method error:", trxError);
          throw new Error(`TRX payment failed: ${trxError.message || trxError}`);
        }
      }
      
      console.log("Transaction result:", tx);

      if (!tx) {
        throw new Error("Transaction failed to execute - no transaction ID returned");
      }

      setTxId(tx);
      setStatus(`Transaction sent: ${tx}. Waiting for confirmation...`);

      // Wait for confirmation
      try {
        const receipt = await waitForTransaction(tronWeb, tx);
        const statusText = receipt && receipt.receipt && receipt.receipt.result === "SUCCESS" ? "CONFIRMED" : "PENDING";
        console.log("Transaction receipt:", receipt);
        
        if (receipt && receipt.receipt && receipt.receipt.result === "REVERT") {
          throw new Error(`Transaction reverted: ${receipt.receipt.message || "Unknown error"}`);
        }
        
        setStatus(`Transaction ${statusText}. Preparing backend update...`);

        // Post to backend
        const payload = {
          txId: tx,
          fromAddress: buyer,
          orderId: orderIdStr,
          amount,
          status: statusText,
          fee: receipt?.fee || 0,
          symbol: isTRC20 ? 'USDT' : 'TRX',
          merchantAddress: MERCHANT,
          contractAddress: ESCROW_VAULT,
          paymentType: isTRC20 ? "USDT" : "TRX",
          attestationRef: attestRef
        };

        console.log("Backend payload:", payload);
        
        // Call backend API
        mutate(payload);

        setStatus(
          `✅ Transaction ${statusText} (${isTRC20 ? "USDT" : "TRX"}). Backend notified.`
        );
      } catch (confirmError: any) {
        console.error("Transaction confirmation error:", confirmError);
        setStatus(`⚠️ Transaction sent but confirmation failed: ${confirmError.message}`);
      }

    } catch (err: any) {
      console.error("Transaction error:", err);
      
      let errorMessage = "Unknown error occurred";
      
      if (err && typeof err === 'object') {
        if (err.message) {
          errorMessage = err.message;
        } else if (err.error) {
          errorMessage = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
        } else {
          errorMessage = JSON.stringify(err);
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setStatus(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, waitForTransaction, ESCROW_VAULT, MERCHANT, USDT_DECIMALS, USDT_CONTRACT, checkoutData, tronWeb, mutate]);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🚀 BorderlessFusePay Checkout</h1>

      {/* TronWeb Status Indicator */}
      <div style={{ 
        marginBottom: "1rem", 
        padding: "0.5rem", 
        backgroundColor: tronWeb ? "#d4edda" : "#f8d7da", 
        borderRadius: "4px",
        fontSize: "0.9rem",
        border: `1px solid ${tronWeb ? "#c3e6cb" : "#f5c6cb"}`
      }}>
        <strong>TronWeb Status:</strong> {tronWeb ? "✅ Connected" : "❌ Not Connected"}
        {tronWeb && tronWeb.defaultAddress && (
          <div><strong>Wallet:</strong> {tronWeb.defaultAddress.base58}</div>
        )}
      </div>

      {/* Debug info */}
      <div style={{ 
        marginBottom: "1rem", 
        padding: "0.5rem", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "4px",
        fontSize: "0.9rem"
      }}>
        <strong>Debug:</strong> Order ID: {checkoutData?.orderNo || "Not loaded"}
        <br />
        <strong>Contract:</strong> {ESCROW_VAULT}
        <br />
        <strong>USDT Contract:</strong> {USDT_CONTRACT}
        <br />
        <strong>Network Check:</strong> 
        <a 
          href={`https://nile.tronscan.org/#/contract/${ESCROW_VAULT}`}
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: "#007bff", marginLeft: "0.5rem" }}
        >
          Verify Contract on Nile TronScan
        </a>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => fundEscrow(true)}
          disabled={isLoading || !tronWeb}
          style={{ 
            padding: "1rem 2rem", 
            marginRight: "1rem",
            backgroundColor: (isLoading || !tronWeb) ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: (isLoading || !tronWeb) ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Processing..." : "Pay 2 USDT (TRC20)"}
        </button>

        <button
          onClick={() => fundEscrow(false)}
          disabled={isLoading || !tronWeb}
          style={{ 
            padding: "1rem 2rem",
            backgroundColor: (isLoading || !tronWeb) ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: (isLoading || !tronWeb) ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Processing..." : "Pay 2 TRX (native)"}
        </button>
      </div>

      {status && (
        <div style={{ 
          padding: "1rem", 
          backgroundColor: status.includes("Error") ? "#ffe6e6" : "#e6ffe6",
          border: `1px solid ${status.includes("Error") ? "#ff9999" : "#99ff99"}`,
          borderRadius: "4px",
          marginBottom: "1rem"
        }}>
          <strong>Status:</strong> {status}
        </div>
      )}
      
      {txId && (
        <div style={{ 
          padding: "1rem", 
          backgroundColor: "#f0f8ff",
          border: "1px solid #b3d9ff",
          borderRadius: "4px",
          wordBreak: "break-all"
        }}>
          <strong>Transaction ID:</strong> {txId}
          <br />
          <small>
            <a 
              href={`https://nile.tronscan.org/#/transaction/${txId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: "#007bff" }}
            >
              View on Nile TronScan
            </a>
          </small>
        </div>
      )}
    </div>
  );
}
