"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import IssueCertificate from "../components/IssueCertificate";
import VerifyCertificate from "../components/VerifyCertificate";
import RevokeCertificate from "../components/RevokeCertificate";
import toast, { Toaster } from "react-hot-toast";

type Tab = "issue" | "verify" | "revoke";

export default function Home() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<Tab>("issue");

  return (
    <main className="min-h-screen p-4 md:p-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Certificate Verification
            </h1>
            <p className="text-gray-400 mt-1">
              Blockchain-powered certificate management on Solana
            </p>
          </div>
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg !h-12" />
        </div>

        {!connected ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-500">
              Please connect your Phantom wallet to get started
            </p>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 bg-gray-800/50 p-1 rounded-lg">
              {[
                { key: "issue" as Tab, label: "Issue Certificate", icon: "📜" },
                { key: "verify" as Tab, label: "Verify Certificate", icon: "✅" },
                { key: "revoke" as Tab, label: "Revoke Certificate", icon: "🚫" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              {activeTab === "issue" && <IssueCertificate />}
              {activeTab === "verify" && <VerifyCertificate />}
              {activeTab === "revoke" && <RevokeCertificate />}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
