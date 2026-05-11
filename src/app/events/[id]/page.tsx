"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CalendarDays, MapPin, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/axios";
import { Event } from "@/types";
import { useLang } from "@/lib/LangContext";
import Navbar from "@/components/home/Navbar";
import { Footer } from "@/components/home/BottomSections";
const statusColor: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700",
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};

function EventDetailCarousel({ images, title, status }: { images: string[]; title: string; status: string }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images.length, paused]);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="relative h-96 w-full group" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {images.length > 0 ? (
        images.map((src, i) => (
          <Image key={src} src={src} alt={title} fill priority={i === 0}
            className="object-cover transition-opacity duration-500"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))
      ) : (
        <div className="w-full h-full bg-[#f5f0e8] flex items-center justify-center">
          <CalendarDays size={48} className="text-[#1a7a4a]/30" />
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
      <span className={`absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full z-10 ${statusColor[status]}`}>{status}</span>
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i === idx ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLang();

  const { data: ev, isLoading } = useQuery<Event>({
    queryKey: ["event", id],
    queryFn: () => api.get(`/events/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f6f0]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Link href="/#events" className="inline-flex items-center gap-1.5 text-sm text-[#1a7a4a] font-medium hover:underline mb-6">
            <ArrowLeft size={15} />
            {lang === "bn" ? "ফিরে যান" : "Back to Events"}
          </Link>

          {isLoading && (
            <div className="bg-white rounded-2xl shadow-sm p-8 animate-pulse space-y-4">
              <div className="h-64 bg-gray-100 rounded-xl" />
              <div className="h-5 bg-gray-100 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-24 bg-gray-100 rounded" />
            </div>
          )}

          {ev && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Carousel */}
              {(() => {
                const imgs = (ev.images && ev.images.length > 0) ? ev.images : ev.imageUrl ? [ev.imageUrl] : [];
                return imgs.length > 0 ? (
                  <EventDetailCarousel images={imgs} title={ev.title.en} status={ev.status} />
                ) : (
                  <div className="h-40 bg-[#f5f0e8] flex items-center justify-center">
                    <CalendarDays size={48} className="text-[#1a7a4a]/30" />
                  </div>
                );
              })()}

              {/* Content */}
              <div className="p-6">
                <h1 className="text-xl font-bold text-gray-900 leading-snug mb-3">
                  {lang === "bn" ? ev.title.bn : ev.title.en}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-[#1a7a4a]" />
                    {new Date(ev.date).toLocaleDateString("en-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  {ev.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#1a7a4a]" />
                      {lang === "bn" ? ev.location.bn : ev.location.en}
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {lang === "bn" ? ev.description.bn : ev.description.en}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
