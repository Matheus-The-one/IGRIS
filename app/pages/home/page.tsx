import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Image <span className="text-white opacity-50">Transformations</span>
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-12">
          Convert, encode, and transform your images with just a few clicks.
          Simple, fast, and secure image processing tools.
        </p>
        <Link href="/convert">
          <button className="bg-white text-black font-medium py-4 px-10 rounded-full hover:bg-white/90 transition-all duration-200">
            Get Started
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="min-h-screen px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="border border-white/10 rounded-lg p-8 hover:border-white/30 transition-all duration-300">
            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mb-6">
              <span className="text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Base64 Encoding</h3>
            <p className="text-white/60">
              Convert any image to Base64 format for embedding directly in your
              code or documents.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="border border-white/10 rounded-lg p-8 hover:border-white/30 transition-all duration-300">
            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mb-6">
              <span className="text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">URL or File Upload</h3>
            <p className="text-white/60">
              Process images from an existing URL or upload files directly from
              your device.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="border border-white/10 rounded-lg p-8 hover:border-white/30 transition-all duration-300">
            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mb-6">
              <span className="text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Instant Results</h3>
            <p className="text-white/60">
              Get your transformed images instantly with preview and easy copy
              functionality.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
