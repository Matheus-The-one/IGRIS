"use client";

import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [activeTab, setActiveTab] = useState<"home" | "image" | "bgremover">(
    "home"
  );
  const router = useRouter();

  const handleTabClick = (tab: "home" | "image" | "bgremover") => {
    setActiveTab(tab);
    router.push(`/pages/${tab}`);
  };

  return (
    <nav className="mt-5 max-h-16 gap-7 px-20 w-full flex flex-row items-center justify-between">
      <span
        onClick={() => handleTabClick("home")}
        className="cursor-pointer text-igris text-2xl font-bold relative group"
      >
        <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-igris to-igris/80 hover:from-igris/80 hover:to-igris transition-all duration-300">
          IGRIS
        </span>
        <span className="absolute -inset-1 bg-igris/5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
      </span>
      <div className="flex px-12 border-2 border-igris/90 font-normal rounded-full h-12 flex-row bg-gradient-to-r from-igris/20 to-igris/10 gap-20 items-center justify-center shadow-lg shadow-black/20 backdrop-blur-sm">
        <button
          className={`text-white cursor-pointer px-4 py-1 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-glow-igris ${
            activeTab === "image"
              ? "bg-igris/30 font-medium shadow-sm shadow-igris/40"
              : "hover:bg-igris/15"
          }`}
          onClick={() => handleTabClick("image")}
        >
          Image
        </button>
        <button
          className={`text-white cursor-pointer px-4 py-1 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-glow-igris ${
            activeTab === "bgremover"
              ? "bg-igris/30 font-medium shadow-sm shadow-igris/40"
              : "hover:bg-igris/15"
          }`}
          onClick={() => handleTabClick("bgremover")}
        >
          Background Remover
        </button>
      </div>
      <div className="flex flex-row gap-3 items-center justify-center h-screen">
        {/* contact */}
      </div>
    </nav>
  );
}
