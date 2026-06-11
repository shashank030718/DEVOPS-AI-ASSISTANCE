import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();

    const history = await db
      .collection("generations")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    });
  }
}