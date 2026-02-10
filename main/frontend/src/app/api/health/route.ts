import { NextResponse } from "next/server";
import { certificates } from "../_helpers/storage";

export async function GET() {
  return NextResponse.json({
    status: "Backend API is running",
    timestamp: new Date().toISOString(),
    certificateCount: certificates.size,
  });
}
