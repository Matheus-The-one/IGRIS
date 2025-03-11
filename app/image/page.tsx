"use client";

import React, { useState } from "react";
import { API_URL_IMAGE_TO_BASE64 } from "@/app/utils/apiconstants";
import axios from "axios";
import { Copy, Check } from "lucide-react";
import ConvertButton from "@/app/components/buttons/ConvertButton";

const ImageToBase64Converter = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");
  const [copied, setCopied] = useState(false);

  const handleConvertUrlToBase64 = async () => {
    if (!imageUrl) {
      setError("Please enter an image URL");
      return;
    }

    setLoading(true);
    setError("");
    setBase64("");
    setCopied(false);

    try {
      const response = await axios.get(
        `${API_URL_IMAGE_TO_BASE64}?imageUrl=${encodeURIComponent(imageUrl)}`
      );
      const data = response.data;

      if (data.status === "error") {
        throw new Error(data.message);
      }

      setBase64(data.base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert image");
    } finally {
      setLoading(false);
    }
  };
  const handleActiveTab = (tab: "url" | "upload") => {
    setActiveTab(tab);
    setImageUrl("");
    setFile(null);
    setBase64("");
    setError("");
  };

  const handleConvertFileToBase64 = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");
    setBase64("");
    setCopied(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(API_URL_IMAGE_TO_BASE64, formData);

      const data = response.data;

      if (data.status === "error") {
        throw new Error(data.message);
      }

      setBase64(data.base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert image");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        setError("Failed to copy to clipboard");
      }
    );
  };

  return (
    <div className="min-h-screen  text-white flex mt-20 justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Tab Navigation */}
        <div className="flex mb-8 border-b border-white/10">
          <button
            className={`py-3 px-6 font-medium transition-all duration-200 ${
              activeTab === "url"
                ? "border-b-2 border-white text-white"
                : "text-white/50 hover:text-white/80"
            }`}
            onClick={() => handleActiveTab("url")}
          >
            URL
          </button>
          <button
            className={`py-3 px-6 font-medium transition-all duration-200 ${
              activeTab === "upload"
                ? "border-b-2 border-white text-white"
                : "text-white/50 hover:text-white/80"
            }`}
            onClick={() => handleActiveTab("upload")}
          >
            Upload
          </button>
        </div>

        <div className="mb-8">
          {activeTab === "url" ? (
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Paste image URL here"
                  className="w-full  border-b-2 border-white/50 focus:border-white py-3 px-2 outline-none transition-all duration-200 placeholder-white/50"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <ConvertButton
                onClick={handleConvertUrlToBase64}
                disabled={loading}
                loading={loading}
                fullWidth={true}
                type="button"
              >
                {loading ? "Converting..." : "Convert"}
              </ConvertButton>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-all duration-200">
                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="fileUpload" className="cursor-pointer block">
                  {file ? (
                    <div className="space-y-2">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-white/50 text-sm">
                        {Math.round(file.size / 1024)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-medium">
                        Drop your image here or click to browse
                      </p>
                      <p className="text-white/50 text-sm">
                        JPG, PNG, GIF, SVG
                      </p>
                    </div>
                  )}
                </label>
              </div>
              <ConvertButton
                onClick={handleConvertFileToBase64}
                disabled={loading || !file}
                loading={loading}
                fullWidth={true}
                type="button"
              >
                {loading ? "Converting..." : "Convert"}
              </ConvertButton>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 border border-white/10 rounded-lg bg-white/5 text-white">
            {error}
          </div>
        )}

        {base64 && (
          <div className="space-y-6 over">
            {base64.startsWith("data:image") && (
              <div className="flex justify-center  border border-white/10 rounded-lg overflow-hidden"></div>
            )}

            <div className="relative ">
              <div className="p-4  overflow-x-hidden border border-white/10 rounded-lg bg-white/5 max-h-48 overflow-auto text-white/70 text-sm break-all">
                {base64}
              </div>
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 bg-white text-black border border-black/20    px-1 py-1 rounded-lg text-xs transition-all duration-200"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToBase64Converter;
