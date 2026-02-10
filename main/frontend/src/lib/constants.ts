export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface CertificateData {
  studentName: string;
  courseName: string;
  certificateId: string;
  grade: string;
  issuerAddress: string;
  issueDate: number;
  isRevoked: boolean;
  certificateAddress: string;
}

export interface IssueResponse {
  success: boolean;
  signature: string;
  certificateAddress: string;
  certificate: CertificateData;
  message: string;
  error?: string;
}

export interface VerifyResponse {
  success: boolean;
  certificate: CertificateData;
  isValid: boolean;
  message: string;
  error?: string;
}

export interface RevokeResponse {
  success: boolean;
  signature: string;
  message: string;
  certificate: CertificateData;
  error?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface CertificatesListResponse {
  success: boolean;
  count: number;
  certificates: CertificateData[];
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  }
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const truncateAddress = (address: string, chars = 8): string => {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
