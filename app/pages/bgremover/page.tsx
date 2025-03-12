"use client";
import React, { useState } from "react";
import { Copy, Download, Upload, Link, Image } from "lucide-react";
import ConvertButton from "@/app/components/buttons/ConvertButton";
import { API_URL_BG_REMOVER } from "@/app/utils/apiconstants";
import axios from "axios";
const BgRemoverPage = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResultImage(null); // Reset result when new file is selected
    }
  };

  const handlebgremoverfile = async () => {
    if (!file) return; // Ensure file is selected
    setLoading(true);
    setError(""); // Reset error state
    setResultImage(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(API_URL_BG_REMOVER, formData);

      const data = response.data;

      if (response.status === 200 && data) {
        // Set the image URL directly
        setResultImage(data);
        console.log("Image URL received:", data);
      } else {
        setError(data.error || "Failed to remove background");
      }
    } catch (err) {
      setError("An error occurred while processing the image");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlebgremoverurl = async () => {
    if (!imageUrl) return; // Ensure URL is provided
    setLoading(true);
    setError(""); // Reset error state
    setResultImage(null);

    // Set preview from URL
    setPreview(imageUrl);

    try {
      const response = await axios.post(API_URL_BG_REMOVER, {
        image: imageUrl,
      });

      const data = response.data;

      if (response.status === 200 && data) {
        // Set the image URL directly
        setResultImage(data);
        console.log("Image URL received:", data);
      } else {
        setError(data.error || "Failed to remove background");
      }
    } catch (err) {
      setError("An error occurred while processing the URL");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;

    try {
      // Fetch the image first
      const response = await fetch(resultImage);
      const blob = await response.blob();

      // Create object URL from blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "removed-background.png"; // You can customize the filename
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download image:", err);
      setError("Failed to download image");
    }
  };

  const handleCopy = async () => {
    if (!resultImage) return;

    try {
      // Fetch the image
      const response = await fetch(resultImage);
      const blob = await response.blob();

      // Copy to clipboard using the Clipboard API
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      alert("Image copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy image:", err);

      // Fallback to copying URL if image copy fails
      try {
        await navigator.clipboard.writeText(resultImage);
        alert("Image URL copied to clipboard!");
      } catch (fallbackErr) {
        console.error("Failed to copy URL:", fallbackErr);
        setError("Failed to copy image");
      }
    }
  };

  return (
    <div className="min-h-screen text-white flex mt-20 justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Background Remover</h1>
          <p className="text-white/70">
            Upload an image or paste URL to remove background
          </p>
        </div>

        <div className="flex mb-8 border-b border-white/10">
          <button
            className={`flex items-center gap-2 py-3 px-6 ${
              activeTab === "upload"
                ? "border-b-2 border-white"
                : "text-white/50 hover:text-white/80"
            }`}
            onClick={() => {
              setActiveTab("upload");
              setImageUrl("");
              setResultImage(null);
            }}
          >
            <Upload size={18} /> Upload Image
          </button>
          <button
            className={`flex items-center gap-2 py-3 px-6 ${
              activeTab === "url"
                ? "border-b-2 border-white"
                : "text-white/50 hover:text-white/80"
            }`}
            onClick={() => {
              setActiveTab("url");
              setFile(null);
              setPreview(null);
              setResultImage(null);
            }}
          >
            <Link size={18} /> Image URL
          </button>
        </div>

        <div className="mb-8">
          {activeTab === "upload" ? (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors">
                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="fileUpload" className="cursor-pointer block">
                  {file ? (
                    <div className="space-y-4">
                      <Image className="mx-auto" size={48} />
                      <p className="font-medium">{file.name}</p>
                      <p className="text-white/50 text-sm">
                        {Math.round(file.size / 1024)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="mx-auto" size={48} />
                      <p className="font-medium">
                        Drag & drop image or click to browse
                      </p>
                      <p className="text-white/50 text-sm">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
              <ConvertButton
                onClick={handlebgremoverfile}
                disabled={!file || loading}
                loading={loading}
                fullWidth
              >
                {loading ? "Removing Background..." : "Remove Background"}
              </ConvertButton>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Paste image URL here"
                  className="w-full border-b-2 border-white/50 focus:border-white py-3 px-2 outline-none transition-all placeholder-white/50 bg-transparent"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <ConvertButton
                onClick={handlebgremoverurl}
                disabled={!imageUrl || loading}
                loading={loading}
                fullWidth
              >
                {loading ? "Processing..." : "Remove Background"}
              </ConvertButton>
            </div>
          )}
        </div>

        {(preview || resultImage) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Original Image */}
            {preview && (
              <div className="relative group">
                <div className="absolute inset-0 bg-white/5 rounded-xl" />
                <img
                  src={preview}
                  alt="Original"
                  className="relative rounded-xl w-full h-auto z-10 object-contain max-h-[400px]"
                />
                <div className="absolute bottom-4 left-4 text-sm text-white/70">
                  Original
                </div>
              </div>
            )}

            {/* Result Image */}
            <div className="relative group bg-gradient-to-br from-white/5 to-transparent rounded-xl p-8">
              <div className="absolute inset-0 bg-checkerboard opacity-10 rounded-xl" />
              <div className="relative min-h-[300px] flex items-center justify-center">
                {resultImage ? (
                  <img
                    src={resultImage}
                    alt="Result"
                    className="max-w-full max-h-[400px] object-contain"
                    onError={(e) => {
                      console.error("Error loading image:", resultImage);
                      setError(
                        "Failed to load the processed image. The image URL might be inaccessible."
                      );
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <Download size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-white/70">
                      {loading
                        ? "Processing..."
                        : "Background removed image will appear here"}
                    </p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 left-4 text-sm text-white/70">
                Result
              </div>
              <div className="absolute flex gap-2 bottom-4 right-4">
                {resultImage && (
                  <button
                    onClick={handleDownload}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                    title="Download image"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                )}
                {resultImage && (
                  <button
                    onClick={handleCopy}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                    <span>Copy</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/10 text-red-300">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default BgRemoverPage;
