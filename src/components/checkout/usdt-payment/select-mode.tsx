import { QrCode, Wallet } from "lucide-react";
import React, { useState } from "react";
import { stepProps } from "../usdt-payment";


const paymentMethods = [
    {
        key: "metamask",
        label: "Pay with MetaMask",
        icon: <Wallet size={32} />,
        description: "Connect your MetaMask wallet to pay securely.",
    },
    {
        key: "pay-to-address",
        label: "Pay to Address",
        icon: <QrCode size={32} />,
        description: "Send USDT directly to our payment address.",
    },
];



export default function SelectPaymentMode({
    setStep
}: {
    setStep: (step:stepProps)=>void
}) {
    

   

    return (
        <div
            style={{
                maxWidth: 400,
                margin: "40px auto",
                padding: 32,
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                fontFamily: "Segoe UI, Arial, sans-serif",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: 24, fontWeight: 600 }}>
                Choose Payment Method
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {paymentMethods.map((method) => (
                    <button
                        key={method.key}
                        onClick={() => setStep(method?.key as any)}
                        className={`flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-200 bg-$ [#f5f5f5]/80 cursor-pointer transition-all  outline-none`}
                    >
                        <span>{method.icon}</span>
                        <div className="flex-1 text-left">
                            <div className="font-medium text-[17px]">
                                {method.label}
                            </div>
                            <div className="text-sm text-gray-600">
                                {method.description}
                            </div>
                        </div>
                        {/* {selected === method.key && (
                            <span className="text-[#0078D4] font-bold text-lg ml-2">
                                ✓
                            </span>
                        )} */}
                    </button>
                ))}
            </div>
        </div>
    );
}