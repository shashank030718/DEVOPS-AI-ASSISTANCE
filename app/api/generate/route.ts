import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt.toLowerCase();

    let response = "";

    if (prompt.includes("docker")) {
      response = `FROM python:3.11

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "app.py"]`;
    } else if (prompt.includes("kubernetes")) {
      response = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: flask-app`;
    } else {
      response = "Currently supported: Dockerfile and Kubernetes";
    }

    const db = await connectDB();

    await db.collection("generations").insertOne({
      prompt: body.prompt,
      response,
      createdAt: new Date(),
    });

    return NextResponse.json({
      response,
    });
  } catch (error: any) {
    return NextResponse.json({
      response: error.message,
    });
  }
}