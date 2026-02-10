// In-memory certificate storage (shared across API routes within the same serverless instance)
// Note: Vercel serverless functions may not share memory across invocations.
// For production, use a database. For a hackathon demo, this works.

export interface Certificate {
  studentName: string;
  courseName: string;
  certificateId: string;
  grade: string;
  issuerAddress: string;
  issueDate: number;
  isRevoked: boolean;
  certificateAddress: string;
}

// Use globalThis to persist across hot reloads in dev and across route handlers
const globalStore = globalThis as unknown as {
  certificates?: Map<string, Certificate>;
};

if (!globalStore.certificates) {
  globalStore.certificates = new Map<string, Certificate>();
}

export const certificates = globalStore.certificates;

export function generateMockSignature(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 88; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateMockPublicKey(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
