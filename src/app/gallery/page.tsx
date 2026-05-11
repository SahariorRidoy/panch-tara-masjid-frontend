"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import api from "@/lib/axios";
import { MediaItem, PaginatedData } from "@/types";
import { useLang } from "@/lib/LangContext";
import Navbar from "@/components/home/Navbar";
import { Footer } from "@/components/home/BottomSections";

export default function GalleryPage() {
  const { lang } = useLang();
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [category, setCategory] = useState("all");

  const { data, isLoading } = useQuery<PaginatedData<MediaItem>>({
    queryKey: ["media-gallery", page, category],
    queryFn: () =>
      api.get(`/media?page=${page}&limit=18${category !== "all" ? `&category=${category}` : ""}`).then((r) => r.data.data),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const { data: allData } = useQuery<PaginatedData<MediaItem>>({
    queryKey: ["media-gallery-cats"],
    queryFn: () => api.get("/media?limit=100").then((r) => r.data.data),
    staleTime: 60_000,
  });

  const images = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const cats = ["all", ...Array.from(new Set((allData?.data ?? []).map((m) => m.category).filter(Boolean)))];

  const prev = () => setLightbox((i) => (i! > 0 ? i! - 1 : images.length - 1));
  const next = () => setLightbox((i) => (i! < images.length - 1 ? i! + 1 : 0));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-white to-[#f8fdf9]">
        <div className="container mx-auto px-4 py-12">

          {/* Header */}
          <motion.div className="mb-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-[#1a7a4a] rounded-full" />
              <h1 className="text-4xl font-bold text-gray-900">
                {lang === "bn" ? "ফটো গ্যালারি" : "Photo Gallery"}
              </h1>
            </div>
            <p className="text-gray-500 ml-4">
              {lang === "bn" ? "আমাদের মসজিদের বিভিন্ন মুহূর্তের ছবি" : "Moments captured from our masjid and community"}
            </p>
          </motion.div>

          {/* Category Filter */}
          {cats.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {cats.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                    category === cat
                      ? "bg-[#1a7a4a] text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#1a7a4a] hover:text-[#1a7a4a]"
                  }`}
                >
                  {cat === "all" ? (lang === "bn" ? "সব" : "All") : cat}
                </button>
              ))}
            </div>
          )}

          {/* Skeleton */}
          {isLoading && (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`bg-gray-200 animate-pulse rounded-2xl w-full break-inside-avoid mb-3 ${i % 3 === 0 ? "h-64" : i % 3 === 1 ? "h-44" : "h-52"}`} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && images.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <Images size={48} className="mx-auto mb-4 opacity-30" />
              <p>{lang === "bn" ? "কোনো ছবি পাওয়া যায়নি।" : "No photos found."}</p>
            </div>
          )}

          {/* Masonry Grid */}
          {!isLoading && images.length > 0 && (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
              {images.map((item, idx) => (
                <motion.div
                  key={item._id}
                  className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  onClick={() => setLightbox(idx)}
                >
                  <Image
                    src={item.url}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div>
                      <p className="text-white text-sm font-semibold line-clamp-1">{item.title}</p>
                      {item.category && <span className="text-xs text-white/70 capitalize">{item.category}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-[#1a7a4a] hover:text-[#1a7a4a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} /> {lang === "bn" ? "আগে" : "Prev"}
              </button>
              <span className="text-sm text-gray-500">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-[#1a7a4a] hover:text-[#1a7a4a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {lang === "bn" ? "পরে" : "Next"} <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 sm:left-6 z-10 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-colors"
            >
              <ChevronLeft size={26} />
            </button>

            <motion.div
              key={lightbox}
              className="relative flex flex-col items-center px-16 w-full max-w-5xl"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightbox].url}
                alt={images[lightbox].title}
                width={1200}
                height={800}
                className="object-contain max-h-[80vh] w-full rounded-xl shadow-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-white font-semibold">{images[lightbox].title}</p>
                {images[lightbox].category && (
                  <span className="text-white/50 text-sm capitalize">{images[lightbox].category}</span>
                )}
                <p className="text-white/40 text-xs mt-1">{lightbox + 1} / {images.length}</p>
              </div>
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 sm:right-6 z-10 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-colors"
            >
              <ChevronRight size={26} />
            </button>

            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/25 rounded-full p-2.5 transition-colors"
            >
              <X size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
