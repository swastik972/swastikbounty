"use client";

import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const IssueCertificate: FC = () => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
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

      if (data.success) {
        setResult(data);
        toast.success("Certificate issued successfully!");
        setFormData({ studentName: "", courseName: "", certificateId: "", grade: "" });
      } else {
        toast.error(data.error || "Failed to issue certificate");
      }
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast.error("Failed to connect to backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Issue New Certificate</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter student name"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Course Name</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            placeholder="Enter course name"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Certificate ID</label>
          <input
            type="text"
            name="certificateId"
            value={formData.certificateId}
            onChange={handleChange}
            placeholder="Enter unique certificate ID"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Grade</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors duration-200"
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
        <div className="mt-6 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
          <h3 className="text-green-400 font-semibold mb-2">Certificate Issued Successfully!</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-400">Certificate Address:</span>{" "}
              <code className="text-yellow-300 break-all">{result.certificateAddress}</code>
            </p>
            <p>
              <span className="text-gray-400">Transaction Signature:</span>{" "}
              <code className="text-blue-300 break-all">{result.signature}</code>
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Save the Certificate Address to verify or revoke later.
          </p>
        </div>
      )}
    </div>
  );
};

export default IssueCertificate;
