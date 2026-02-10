import { NextRequest, NextResponse } from "next/server";
import { certificates, generateMockSignature, generateMockPublicKey } from "../../_helpers/storage";

export async function POST(request: NextRequest) {
  try {
    const { studentName, courseName, certificateId, grade, issuerAddress } = await request.json();

    if (!studentName || !courseName || !certificateId || !grade) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const certificateAddress = generateMockPublicKey();

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

    certificates.set(certificateAddress, certificate);

    return NextResponse.json({
      success: true,
      signature: generateMockSignature(),
      certificateAddress,
      certificate,
      message: "Certificate issued successfully",
    });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return NextResponse.json({ error: "Failed to issue certificate" }, { status: 500 });
  }
}
