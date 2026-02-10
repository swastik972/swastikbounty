"use client";

import { FC, useState } from "react";
import toast from "react-hot-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface CertificateData {
  studentName: string;
  courseName: string;
  certificateId: string;
  grade: string;
  issuerAddress: string;
  issueDate: number;
  isRevoked: boolean;
  certificateAddress: string;
}

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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Verify Certificate</h2>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Certificate Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter certificate account address"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
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
            <div>
              <span className="text-gray-400">Issuer Address:</span>
              <p className="text-yellow-300 break-all text-xs mt-1">
                {certificate.issuerAddress}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
