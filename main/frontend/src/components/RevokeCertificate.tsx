"use client";

import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const RevokeCertificate: FC = () => {
  const { publicKey } = useWallet();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter a certificate address");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/certificate/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificateAddress: address.trim(),
          revokerAddress: publicKey.toBase58(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        toast.success("Certificate revoked successfully!");
        setAddress("");
      } else {
        toast.error(data.error || "Failed to revoke certificate");
      }
    } catch (error) {
      console.error("Error revoking certificate:", error);
      toast.error("Failed to connect to backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Revoke Certificate</h2>

      <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
        <p className="text-yellow-400 text-sm">
          ⚠️ Warning: Revoking a certificate is permanent. Only the original
          issuer can revoke a certificate.
        </p>
      </div>

      <form onSubmit={handleRevoke} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Certificate Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter certificate account address to revoke"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Revoking...
            </span>
          ) : (
            "Revoke Certificate"
          )}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
          <h3 className="text-red-400 font-semibold mb-2">
            Certificate Revoked Successfully
          </h3>
          <div className="text-sm">
            <p>
              <span className="text-gray-400">Transaction Signature:</span>{" "}
              <code className="text-blue-300 break-all">{result.signature}</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevokeCertificate;
