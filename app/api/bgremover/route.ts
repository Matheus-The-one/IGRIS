import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let image;

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await req.formData();
      const file = formData.get("image") as File;

      if (!file) {
        return NextResponse.json(
          { error: "Image file is required" },
          { status: 400 }
        );
      }

      // Convert file to base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const mimeType = file.type;
      image = `data:${mimeType};base64,${base64}`;
    } else {
      // Handle JSON request (URL or base64)
      const body = await req.json();
      image = body.image;

      if (!image) {
        return NextResponse.json(
          { error: "Image is required" },
          { status: 400 }
        );
      }
    }

    let base64Image;

    // Check if the image is a base64 string or a URL
    if (typeof image === "string") {
      if (image.startsWith("data:image/")) {
        // If it's already base64, use it directly
        base64Image = image;
      } else {
        // If it's a URL, convert it to base64
        try {
          const response = await axios.get(image, {
            responseType: "arraybuffer",
          });
          const buffer = Buffer.from(response.data, "binary").toString(
            "base64"
          );
          const contentType = response.headers["content-type"] || "image/jpeg";
          base64Image = `data:${contentType};base64,${buffer}`;
        } catch (error) {
          return NextResponse.json(
            { error: "Failed to fetch image from URL" },
            { status: 400 }
          );
        }
      }
    } else {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      );
    }
    console.log(base64Image);
    const apiResponse = await axios.post(
      "https://mlbgremover-153969372242.us-central1.run.app/remove-background",
      { image: base64Image }
    );
    const resultImage = await axios.post(
      "https://stamoaibackend-153969372242.us-central1.run.app/api/resources/upload-image",
      {
        ImageData: apiResponse.data.image,
      }
    );
    console.log(resultImage.data);
    return NextResponse.json(resultImage.data);
  } catch (error) {
    console.error("Background removal error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
