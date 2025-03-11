// app/api/imagetobase64/helper.ts
import { Buffer } from "buffer";

export const convertImageToBase64 = async (imageUrl: string) => {
  try {
    if (!imageUrl) {
      throw new Error("Image URL is required");
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${
      response.headers.get("content-type") || "image/jpeg"
    };base64,${buffer.toString("base64")}`;

    return base64;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
};

export const convertFileToBase64 = async (file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
    return base64;
  } catch (error) {
    console.error("Error converting file to base64:", error);
    throw error;
  }
};
