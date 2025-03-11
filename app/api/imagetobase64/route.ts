// app/api/imagetobase64/route.ts
import { NextRequest, NextResponse } from "next/server";
import { convertImageToBase64, convertFileToBase64 } from "./helper";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          status: "error",
          message: "No file uploaded",
        },
        { status: 400 }
      );
    }

    const base64 = await convertFileToBase64(file);

    return NextResponse.json({
      status: "success",
      base64,
      filename: file.name,
      type: file.type,
    });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("imageUrl");

    if (!imageUrl) {
      return NextResponse.json(
        {
          status: "error",
          message: "Image URL is required",
        },
        { status: 400 }
      );
    }

    const base64 = await convertImageToBase64(imageUrl);

    return NextResponse.json({
      status: "success",
      base64,
    });
  } catch (error) {
    console.error("Error processing image URL:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
