const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));
app.use(bodyParser.json());

// Error handling middleware for JSON parse errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// In-memory certificate storage
const certificates = new Map();
const certificateAccounts = new Map(); // Map certificate address to certificate data

// Helper function to generate mock transaction signature
const generateMockSignature = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 88; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper function to generate Solana-like public key
const generateMockPublicKey = () => {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Issue Certificate Endpoint
app.post("/api/certificate/issue", (req, res) => {
  try {
    const { studentName, courseName, certificateId, grade, issuerAddress } =
      req.body;

    // Validate input
    if (!studentName || !courseName || !certificateId || !grade) {
      return res
        .status(400)
        .json({ error: "Missing required fields" });
    }

    // Generate mock certificate account address
    const certificateAddress = generateMockPublicKey();

    // Create certificate object
    const certificate = {
      studentName,
      courseName,
      certificateId,
      grade,
      issuerAddress,
      issueDate: Math.floor(Date.now() / 1000),
      isRevoked: false,
      certificateAddress,
    };

    // Store certificate
    certificates.set(certificateAddress, certificate);
    certificateAccounts.set(certificateAddress, certificate);

    // Return mock transaction response
    res.json({
      success: true,
      signature: generateMockSignature(),
      certificateAddress,
      certificate,
      message: "Certificate issued successfully",
    });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    res.status(500).json({ error: "Failed to issue certificate" });
  }
});

// Revoke Certificate Endpoint
app.post("/api/certificate/revoke", (req, res) => {
  try {
    const { certificateAddress } = req.body;

    if (!certificateAddress) {
      return res.status(400).json({ error: "Certificate address is required" });
    }

    const certificate = certificates.get(certificateAddress);

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    certificate.isRevoked = true;
    certificates.set(certificateAddress, certificate);

    res.json({
      success: true,
      signature: generateMockSignature(),
      message: "Certificate revoked successfully",
    });
  } catch (error) {
    console.error("Error revoking certificate:", error);
    res.status(500).json({ error: "Failed to revoke certificate" });
  }
});

// Verify Certificate Endpoint
app.get("/api/certificate/verify/:address", (req, res) => {
  try {
    const { address } = req.params;

    const certificate = certificates.get(address);

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    res.json({
      success: true,
      certificate,
      isValid: !certificate.isRevoked,
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    res.status(500).json({ error: "Failed to verify certificate" });
  }
});

// Get All Certificates Endpoint
app.get("/api/certificates", (req, res) => {
  try {
    const allCertificates = Array.from(certificates.entries()).map(
      ([address, cert]) => ({
        address,
        ...cert,
      })
    );

    res.json({
      success: true,
      certificates: allCertificates,
      total: allCertificates.length,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend API is running", timestamp: new Date() });
});

// Export as Firebase Cloud Function
exports.api = functions.https.onRequest(app);
