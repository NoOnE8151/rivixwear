import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { sessionClaims } = await auth();
  console.log("Full sessionClaims:", JSON.stringify(sessionClaims, null, 2));
  const userRole = sessionClaims?.metadata?.role;
  console.log("user's current role in the website is: ", userRole);
  return NextResponse.json({
    success: true,
  });
}