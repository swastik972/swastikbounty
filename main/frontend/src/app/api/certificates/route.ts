import { NextResponse } from "next/server";
import { certificates } from "../_helpers/storage";

export async function GET() {
  try {
    const allCertificates = Array.from(certificates.values());
    return NextResponse.json({
      success: true,
      count: allCertificates.length,
      certificates: allCertificates,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}
