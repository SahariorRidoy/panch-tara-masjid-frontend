"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CalendarDays, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
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

function EventImageCarousel({ images, title, status }: { images: string[]; title: string; status: string }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const offset = useState(() => Math.floor(Math.random() * 2000))[0];

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3000 + offset);
    return () => clearInterval(t);
  }, [images.length, paused, offset]);

  const prev = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); };
  const next = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIdx((i) => (i + 1) % images.length); };

  return (
    <div className="relative h-48 bg-[#f5f0e8] group" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {images.length > 0 ? (
        images.map((src, i) => (
          <Image key={src} src={src} alt={title} fill
            className="object-cover transition-opacity duration-500"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <CalendarDays size={40} className="text-[#1a7a4a]/20" />
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
      <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-0.5 rounded-full z-10 ${statusColor[status]}`}>{status}</span>
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button key={i} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
                className={`rounded-full transition-all ${i === idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function EventsPage() {
  const { lang } = useLang();

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["events-all"],
    queryFn: () => api.get("/events?limit=100").then((r) => r.data.data?.data ?? r.data.data),
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f6f0]">

        {/* Hero */}
        <section className="bg-linear-to-r from-[#1a7a4a] to-[#15633d] py-13.5">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a017] mb-2">
              {lang === "bn" ? "আমাদের ইভেন্টসমূহ" : "Our Events"}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {lang === "bn" ? "সকল ইভেন্ট" : "All Events"}
            </h1>
            <p className="text-white/80 text-md max-w-lg mx-auto">
              {lang === "bn"
                ? "পাঁচ তারা জামে মসজিদের সকল আসন্ন ও সাম্প্রতিক ইভেন্টগুলো দেখুন।"
                : "Browse all upcoming and recent events at Panch Tara Jame Masjid."}
            </p>
          </div>
        </section>

        <section className="py-12 bg-[#f8f6f0]">
        <div className="container mx-auto px-4">

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => {
                const imgs = (ev.images && ev.images.length > 0) ? ev.images : ev.imageUrl ? [ev.imageUrl] : [];
                return (
                <Link key={ev._id} href={`/events/${ev._id}`} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <EventImageCarousel images={imgs} title={ev.title.en} status={ev.status} />
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                      <CalendarDays size={12} />
                      {new Date(ev.date).toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <p className="font-semibold text-sm text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-[#1a7a4a] transition-colors">
                      {lang === "bn" ? ev.title.bn : ev.title.en}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-3 mb-3">
                      {lang === "bn" ? ev.description.bn : ev.description.en}
                    </p>
                    {ev.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                        <MapPin size={11} />
                        {lang === "bn" ? ev.location.bn : ev.location.en}
                      </div>
                    )}
                    <span className="mt-auto text-xs font-semibold text-[#1a7a4a] group-hover:underline">
                      {lang === "bn" ? "বিস্তারিত দেখুন →" : "View Details →"}
                    </span>
                  </div>
                </Link>
                );
              })}

              {events.length === 0 && (
                <p className="text-gray-500 text-sm col-span-3">
                  {lang === "bn" ? "কোনো ইভেন্ট পাওয়া যায়নি।" : "No events found."}
                </p>
              )}
            </div>
          )}
        </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
