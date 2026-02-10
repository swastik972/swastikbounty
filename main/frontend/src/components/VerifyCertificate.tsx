"use client";

import { FC, useState } from "react";
import toast from "react-hot-toast";
import {
  BACKEND_URL,
  CertificateData,
  copyToClipboard,
  formatDate,
  truncateAddress,
} from "@/lib/constants";

const VerifyCertificate: FC = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      toast.error("Please enter a certificate address");
      return;
    }

    setLoading(true);
    setCertificate(null);
    setIsValid(null);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/certificate/verify/${address.trim()}`
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Certificate not found");
        return;
      }

      if (data.success) {
        setCertificate(data.certificate);
        setIsValid(data.isValid);
        if (data.isValid) {
          toast.success("Certificate is valid!");
        } else {
          toast.error("Certificate has been revoked!");
        }
      } else {
        toast.error(data.error || "Certificate not found");
      }
    } catch (error) {
      console.error("Error verifying certificate:", error);
      toast.error("Failed to connect to backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    const ok = await copyToClipboard(text);
    if (ok) toast.success(`${label} copied!`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Verify Certificate</h2>
      <p className="text-gray-500 text-sm mb-5">
        Enter a certificate address to check its authenticity and status.
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Certificate Address <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter certificate account address"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying...
            </span>
          ) : (
            "Verify Certificate"
          )}
        </button>
      </form>

      {certificate && (
        <div
          className={`mt-6 p-4 rounded-lg border ${
            isValid
              ? "bg-green-900/20 border-green-700/50"
              : "bg-red-900/20 border-red-700/50"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{isValid ? "✅" : "❌"}</span>
            <h3
              className={`font-semibold ${
                isValid ? "text-green-400" : "text-red-400"
              }`}
            >
              {isValid ? "Valid Certificate" : "Certificate Revoked"}
            </h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">Student Name:</span>
                <p className="text-white font-medium">{certificate.studentName}</p>
              </div>
              <div>
                <span className="text-gray-400">Course Name:</span>
                <p className="text-white font-medium">{certificate.courseName}</p>
              </div>
              <div>
                <span className="text-gray-400">Certificate ID:</span>
                <p className="text-white font-medium">{certificate.certificateId}</p>
              </div>
              <div>
                <span className="text-gray-400">Grade:</span>
                <p className="text-white font-medium">{certificate.grade}</p>
              </div>
              <div>
                <span className="text-gray-400">Issue Date:</span>
                <p className="text-white font-medium">
                  {formatDate(certificate.issueDate)}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <p
                  className={`font-medium ${
                    certificate.isRevoked ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {certificate.isRevoked ? "Revoked" : "Active"}
                </p>
              </div>
            </div>
            <div className="flex items-start justify-between gap-2 p-2 bg-gray-900/30 rounded">
              <div className="min-w-0">
                <span className="text-gray-400">Issuer Address:</span>
                <p className="text-yellow-300 break-all text-xs mt-1 font-mono">
                  {certificate.issuerAddress}
                </p>
              </div>
              <button onClick={() => handleCopy(certificate.issuerAddress, "Address")} className="shrink-0 text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 transition-colors" title="Copy address">&#128203;</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
