"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { MediaItem, PaginatedData } from "@/types";
import { useLang } from "@/lib/LangContext";

export function GallerySection() {
  const { lang } = useLang();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { data, isLoading } = useQuery<PaginatedData<MediaItem>>({
    queryKey: ["media-home"],
    queryFn: () => api.get("/media?limit=12").then((r) => r.data.data),
    staleTime: 60_000,
  });

  const images = data?.data ?? [];

  const prev = () => setLightbox((i) => (i! > 0 ? i! - 1 : images.length - 1));
  const next = () => setLightbox((i) => (i! < images.length - 1 ? i! + 1 : 0));

  if (!isLoading && images.length === 0) return null;

  return (
    <section className="py-20 bg-[#f8f6f0] relative overflow-hidden">
      <div className="absolute inset-0 pattern-geometric" />
      <div className="relative z-10 container mx-auto px-4">

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            {lang === "bn" ? "ফটো গ্যালারি" : "Photo Gallery"}
          </h2>
          <p className="text-gray-600">
            {lang === "bn"
              ? "আমাদের মসজিদের বিভিন্ন মুহূর্তের ছবি"
              : "Moments captured from our masjid and community"}
          </p>
        </motion.div>

        {/* Skeleton */}
        {isLoading && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`bg-gray-200 animate-pulse rounded-2xl w-full break-inside-avoid mb-3 ${i % 3 === 0 ? "h-56" : i % 3 === 1 ? "h-40" : "h-48"}`} />
            ))}
          </div>
        )}

        {/* Masonry columns */}
        {!isLoading && images.length > 0 && (
          <>
            {/* Desktop/Laptop: custom pattern */}
            <div className="hidden lg:grid grid-cols-3 grid-rows-3 gap-3">
              {/* Row 1 & 2: large image left (spans 2 rows), 1 image top-right, 1 image bottom-right */}
              {images[0] && (
                <div className="col-span-2 row-span-2 relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[420px]"
                  onClick={() => setLightbox(0)}>
                  <Image src={images[0].url} alt={images[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="66vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-semibold line-clamp-1">{images[0].title}</p>
                  </div>
                </div>
              )}
              {[1, 2].map((idx) => images[idx] && (
                <div key={idx} className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[204px]"
                  onClick={() => setLightbox(idx)}>
                  <Image src={images[idx].url} alt={images[idx].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-xs font-semibold line-clamp-1">{images[idx].title}</p>
                  </div>
                </div>
              ))}
              {[3, 4, 5].map((idx) => images[idx] && (
                <div key={idx} className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[200px]"
                  onClick={() => setLightbox(idx)}>
                  <Image src={images[idx].url} alt={images[idx].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-xs font-semibold line-clamp-1">{images[idx].title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet: 2 columns grid */}
            <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3">
              {images.map((item, idx) => (
                <div key={item._id} className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[200px]"
                  onClick={() => setLightbox(idx)}>
                  <Image src={item.url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-xs font-semibold line-clamp-1">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: 1 column full width */}
            <div className="flex sm:hidden flex-col gap-3">
              {images.map((item, idx) => (
                <div key={item._id} className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[220px]"
                  onClick={() => setLightbox(idx)}>
                  <Image src={item.url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-xs font-semibold line-clamp-1">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* View All */}
        {!isLoading && images.length > 0 && (
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 bg-[#1a7a4a] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#155f3a] transition-all shadow-lg hover:shadow-xl"
            >
              <Images size={18} />
              {lang === "bn" ? "সব ছবি দেখুন" : "View All Photos"}
            </Link>
          </motion.div>
        )}
      </div>

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
              className="flex flex-col items-center px-16 w-full max-w-5xl"
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
    </section>
  );
}
