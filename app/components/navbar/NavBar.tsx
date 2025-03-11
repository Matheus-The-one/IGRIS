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
    router.push(`/${tab}`);
  };

  return (
    <nav className="mt-5 max-h-16 gap-7 px-20 w-full flex flex-row items-center justify-between">
      <span
        onClick={() => handleTabClick("home")}
        className="cursor-pointer text-white text-2xl font-bold"
      >
        IGRIS
      </span>
      <div className="flex px-12 font-normal rounded-full h-12 flex-row bg-gradient-to-r from-[#1c1c1c] to-[#2a2a2a] gap-20 items-center justify-center shadow-lg shadow-black/20">
        <button
          className={`text-white cursor-pointer px-4 py-1 rounded-full transition-all duration-200 transform hover:translate-y-0.5 ${
            activeTab === "image"
              ? "bg-white/10 font-medium"
              : "hover:bg-white/5"
          }`}
          onClick={() => handleTabClick("image")}
        >
          Image
        </button>
        <button
          className={`text-white cursor-pointer px-4 py-1 rounded-full transition-all duration-200 transform hover:translate-y-0.5 ${
            activeTab === "bgremover"
              ? "bg-white/10 font-medium"
              : "hover:bg-white/5"
          }`}
          onClick={() => handleTabClick("bgremover")}
        >
          Background Remover
        </button>
      </div>
      <div className="flex flex-row  gap-3 items-center justify-center h-screen">
        {/* contact */}
      </div>
    </nav>
  );
}
