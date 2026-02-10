"use client";

import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { BACKEND_URL, IssueResponse, copyToClipboard } from "@/lib/constants";

const IssueCertificate: FC = () => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IssueResponse | null>(null);
  const [formData, setFormData] = useState({
    studentName: "",
    courseName: "",
    certificateId: "",
    grade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!formData.studentName || !formData.courseName || !formData.certificateId || !formData.grade) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/certificate/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          issuerAddress: publicKey.toBase58(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      const issueData = data as IssueResponse;
      if (issueData.success) {
        setResult(issueData);
        toast.success("Certificate issued successfully!");
        setFormData({ studentName: "", courseName: "", certificateId: "", grade: "" });
      } else {
        toast.error(data.error || "Failed to issue certificate");
      }
    } catch (error: any) {
      console.error("Error issuing certificate:", error);
      toast.error(error.message || "Failed to connect to backend. Is the server running?");
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
      <h2 className="text-xl font-semibold mb-1">Issue New Certificate</h2>
      <p className="text-gray-500 text-sm mb-5">
        Fill in the details below to issue a new blockchain-verified certificate.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Student Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter student name"
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Course Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="Enter course name"
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Certificate ID <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="certificateId"
              value={formData.certificateId}
              onChange={handleChange}
              placeholder="Enter unique certificate ID"
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Grade <span className="text-red-400">*</span></label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            title="Select grade"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="">Select grade</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-purple-800 disabled:to-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-600/20"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Issuing Certificate...
            </span>
          ) : (
            "Issue Certificate"
          )}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-5 bg-green-900/20 border border-green-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">&#x2705;</span>
            <h3 className="text-green-400 font-semibold">Certificate Issued Successfully!</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-2 p-3 bg-gray-900/50 rounded-lg">
              <div className="min-w-0">
                <span className="text-gray-400 text-xs">Certificate Address</span>
                <p className="text-yellow-300 break-all font-mono text-xs mt-0.5">{result.certificateAddress}</p>
              </div>
              <button onClick={() => handleCopy(result.certificateAddress, "Address")} className="shrink-0 text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-700 transition-colors" title="Copy address">&#128203;</button>
            </div>
            <div className="flex items-start justify-between gap-2 p-3 bg-gray-900/50 rounded-lg">
              <div className="min-w-0">
                <span className="text-gray-400 text-xs">Transaction Signature</span>
                <p className="text-blue-300 break-all font-mono text-xs mt-0.5">{result.signature}</p>
              </div>
              <button onClick={() => handleCopy(result.signature, "Signature")} className="shrink-0 text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-700 transition-colors" title="Copy signature">&#128203;</button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Save the Certificate Address &mdash; you&apos;ll need it to verify or revoke this certificate.
          </p>
        </div>
      )}
    </div>
  );
};

export default IssueCertificate;
