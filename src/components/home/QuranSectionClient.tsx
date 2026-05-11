"use client";
import dynamic from "next/dynamic";

const QuranSection = dynamic(() => import("./QuranSection"), { ssr: false });

export default function QuranSectionClient() {
  return <QuranSection />;
}
