"use client";

import React, { useEffect, useState } from "react";
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
  const [activeTab, setActiveTab] = useState<"url" | "upload" | "base64">(
    "url"
  );
  const [copied, setCopied] = useState(false);
  const [isJson, setIsJson] = useState(false);

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
  const handleActiveTab = (tab: "url" | "upload" | "base64") => {
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

  const extractBase64 = (input: string) => {
    // Try to find base64 in common patterns
    const base64Regex = /(?:data:[\w/+-]+;base64,)?([A-Za-z0-9+/=]+)/;
    const match = input.match(base64Regex);

    // Try to parse JSON if no direct match
    if (!match) {
      try {
        const json = JSON.parse(input);
        if (json.data || json.base64) {
          return json.data || json.base64;
        }
      } catch (e) {
        return null;
      }
    }

    return match ? match[1] : null;
  };

  const handleConvertBase64ToImage = () => {
    try {
      if (!base64) {
        setError("Please enter a base64 string");
        return;
      }

      const extracted = extractBase64(base64);
      if (!extracted) {
        throw new Error("No valid base64 found in input");
      }

      // Validate if it's actually a base64 string
      if (!/^[A-Za-z0-9+/=]+$/.test(extracted)) {
        throw new Error("Invalid base64 characters detected");
      }

      // Try to determine MIME type
      const mimeMatch = base64.match(/data:([\w/+-]+);/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/png";

      if (!mimeType.startsWith("image/")) {
        throw new Error("Base64 does not contain image data");
      }

      const fullBase64 = `data:${mimeType};base64,${extracted}`;
      setBase64(fullBase64);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid base64 input");
    }
  };

  const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBase64(value);

    // Check if input is JSON
    try {
      JSON.parse(value);
      setIsJson(true);
    } catch {
      setIsJson(false);
    }
  };

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (activeTab === "url") {
          if (imageUrl.trim()) handleConvertUrlToBase64();
        } else if (activeTab === "upload") {
          if (file) handleConvertFileToBase64();
        } else if (activeTab === "base64") {
          if (base64.trim()) handleConvertBase64ToImage();
        }
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => document.removeEventListener("keydown", handleEnter);
  }, [activeTab, imageUrl, file, base64]);

  const copyToClipboard = () => {
    const textToCopy = isJson ? JSON.stringify(JSON.parse(base64)) : base64;
    navigator.clipboard.writeText(textToCopy).then(
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
          <button
            className={`py-3 px-6 font-medium transition-all duration-200 ${
              activeTab === "base64"
                ? "border-b-2 border-white text-white"
                : "text-white/50 hover:text-white/80"
            }`}
            onClick={() => handleActiveTab("base64")}
          >
            base64 to image
          </button>
        </div>
        <div className="mb-8">
          {activeTab === "url" ? (
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Paste image URL here"
                  className="w-full border-b-2 border-white/50 focus:border-white py-3 px-2 outline-none transition-all duration-200 placeholder-white/50"
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
          ) : activeTab === "upload" ? (
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
          ) : (
            <div className="space-y-6">
              <div className="relative">
                {isJson ? (
                  <pre className="bg-white/5 p-4 rounded-lg">
                    <code>
                      <textarea
                        value={JSON.stringify(JSON.parse(base64), null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setBase64(JSON.stringify(parsed));
                          } catch (err) {
                            setBase64(e.target.value);
                          }
                        }}
                        className="w-full h-48 font-mono text-sm bg-transparent outline-none resize-none"
                      />
                    </code>
                  </pre>
                ) : (
                  <textarea
                    placeholder="Paste base64 or JSON here"
                    className="w-full border-b-2 border-white/50 focus:border-white py-3 px-2 outline-none transition-all duration-200 placeholder-white/50 bg-transparent h-32 resize-none"
                    value={base64}
                    onChange={handleBase64Change}
                  />
                )}
              </div>
              <ConvertButton
                onClick={handleConvertBase64ToImage}
                disabled={loading || !base64}
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

        {base64 && activeTab === "base64" && (
          <div className="space-y-6">
            {base64.startsWith("data:image") ? (
              <div className="flex justify-center border border-white/10 rounded-lg overflow-hidden">
                <img
                  src={base64}
                  alt="Converted"
                  className="max-w-full h-auto"
                />
              </div>
            ) : (
              <div className="p-4 overflow-x-hidden border border-white/10 rounded-lg bg-white/5 max-h-48 overflow-auto text-white/70 text-sm break-all">
                {isJson ? (
                  <pre className="whitespace-pre-wrap">
                    <code>{JSON.stringify(JSON.parse(base64), null, 2)}</code>
                  </pre>
                ) : (
                  base64
                )}
              </div>
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
