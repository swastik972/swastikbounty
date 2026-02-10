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
    <main className="min-h-screen flex flex-col">
      <Toaster position="top-right" toastOptions={{ style: { background: "#1e1e3a", color: "#fff", border: "1px solid #333" } }} />

      <div className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
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
              <div className="text-6xl mb-4">&#x1F517;</div>
              <h2 className="text-2xl font-semibold text-gray-300 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Connect your Phantom wallet to issue, verify, and revoke
                blockchain-verified certificates on Solana Devnet.
              </p>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex gap-1 sm:gap-2 mb-6 bg-gray-800/50 p-1 rounded-lg">
                {[
                  { key: "issue" as Tab, label: "Issue", fullLabel: "Issue Certificate", icon: "&#x1F4DC;" },
                  { key: "verify" as Tab, label: "Verify", fullLabel: "Verify Certificate", icon: "&#x2705;" },
                  { key: "revoke" as Tab, label: "Revoke", fullLabel: "Revoke Certificate", icon: "&#x1F6AB;" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-3 px-2 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                      activeTab === tab.key
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <span className="mr-1 sm:mr-2" dangerouslySetInnerHTML={{ __html: tab.icon }} />
                    <span className="hidden sm:inline">{tab.fullLabel}</span>
                    <span className="sm:hidden">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6">
                {activeTab === "issue" && <IssueCertificate />}
                {activeTab === "verify" && <VerifyCertificate />}
                {activeTab === "revoke" && <RevokeCertificate />}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 text-xs border-t border-gray-800/50">
        <p>
          Solana Certificate Verification &middot; Built on Solana Devnet
        </p>
      </footer>
    </main>
  );
}
