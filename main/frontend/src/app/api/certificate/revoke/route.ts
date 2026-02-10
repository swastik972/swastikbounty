import { NextRequest, NextResponse } from "next/server";
import { certificates, generateMockSignature } from "../../_helpers/storage";

export async function POST(request: NextRequest) {
  try {
    const { certificateAddress, issuerAddress } = await request.json();

    if (!certificateAddress) {
      return NextResponse.json({ error: "Missing certificate address" }, { status: 400 });
    }

    const certificate = certificates.get(certificateAddress);
    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    if (certificate.issuerAddress !== issuerAddress) {
      return NextResponse.json({ error: "Only the issuer can revoke this certificate" }, { status: 403 });
    }

    certificate.isRevoked = true;
    certificates.set(certificateAddress, certificate);

    return NextResponse.json({
      success: true,
      signature: generateMockSignature(),
      message: "Certificate revoked successfully",
      certificate,
    });
  } catch (error) {
    console.error("Error revoking certificate:", error);
    return NextResponse.json({ error: "Failed to revoke certificate" }, { status: 500 });
  }
}
