"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="text-8xl font-bold text-red-500 mb-4">500</div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Something Went Wrong</h1>
      <p className="text-gray-500 mb-8">An unexpected error occurred. Please try again.</p>
      <div className="flex gap-3">
        <button onClick={reset} className="bg-[#1a7a4a] text-white px-6 py-2.5 rounded-lg hover:bg-[#155f3a] transition-colors font-medium">
          Try Again
        </button>
        <Link href="/" className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors font-medium">
          Go Home
        </Link>
      </div>
    </div>
  );
}
