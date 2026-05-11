"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { MarqueeData } from "@/types";

export default function MarqueeBanner() {
  const { data, isLoading } = useQuery<MarqueeData>({
    queryKey: ["marquee"],
    queryFn: () => api.get("/marquee").then((r) => r.data.data),
  });

  if (isLoading) return <div className="py-1.5 h-[34px] bg-[#1a7a4a] animate-pulse" />;
  if (!data?.isActive) return null;

  const text = `${data.text.en}   |   ${data.text.bn}`;

  return (
    <div style={{ backgroundColor: data.bgColor, color: data.textColor }} className="py-1.5 text-sm font-medium overflow-hidden">
      {/* Desktop */}
      <div className="hidden md:block max-w-375 mx-auto overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">{text}</div>
      </div>
      {/* Mobile */}
      <div className="md:hidden overflow-hidden">
        <div className="animate-marquee-mobile whitespace-nowrap">{text}</div>
      </div>
    </div>
  );
}
