import { NextRequest, NextResponse } from "next/server";
import { certificates } from "../../../_helpers/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;

    const certificate = certificates.get(address);
    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const isValid = !certificate.isRevoked;

    return NextResponse.json({
      success: true,
      valid: isValid,
      isValid,
      certificate,
      message: isValid ? "Certificate is valid" : "Certificate has been revoked",
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json({ error: "Failed to verify certificate" }, { status: 500 });
  }
}
