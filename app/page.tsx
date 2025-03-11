"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
      // Navigate to home page after loading
      router.push("/home");
    }, 300); // 3 seconds loading time

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : null}
    </div>
  );
};

export default Page;
