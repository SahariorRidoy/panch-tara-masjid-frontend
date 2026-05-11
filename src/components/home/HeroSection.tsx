"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import api from "@/lib/axios";
import { HeroSlide, ContactInfo } from "@/types";
import { useLang } from "@/lib/LangContext";

// Floating particle orb
function Orb({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: "blur(1px)" }}
      animate={{ y: [0, -18, 0], opacity: [0.18, 0.38, 0.18], scale: [1, 1.15, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const { data: slides = [] } = useQuery<HeroSlide[]>({
    queryKey: ["hero"],
    queryFn: () => api.get("/hero").then((r) => r.data.data),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const { data: contact } = useQuery<ContactInfo>({
    queryKey: ["contact"],
    queryFn: () => api.get("/contact").then((r) => r.data.data),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const goTo = (index: number) => {
    if (animating || index === current) return;
    setPrev(current);
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 800);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => goTo((current + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length, current, animating]);

  const slide = slides[current];
  const { lang } = useLang();

  const title = lang === "bn"
    ? (slide?.title?.bn ?? contact?.masjidName?.bn ?? "পাঁচ  তারা জামে মসজিদ")
    : (slide?.title?.en ?? contact?.masjidName?.en ?? "Panch Tara Jame Masjid");

  const tagline = lang === "bn"
    ? (slide?.tagline?.bn ?? contact?.tagline?.bn ?? "শান্তি ও সম্প্রদায়ের স্থান")
    : (slide?.tagline?.en ?? contact?.tagline?.en ?? "A place of peace and community");

  return (
    <div className="relative w-full bg-[#ffffff] pattern-geometric">
    <div className="sm:container sm:mx-auto sm:px-4 sm:py-4">
      <section className="relative w-full overflow-hidden rounded-none sm:rounded-2xl bg-[#0d1b2a] aspect-5/2 sm:aspect-16/7 lg:aspect-16/6">

        {/* Slides */}
        {slides.length > 0 ? slides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-800 ease-in-out"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <Image
              src={s.imageUrl || "/banner.jpg"}
              alt={s.title?.en ?? ""}
              fill
              className={`object-cover transition-transform duration-[8000ms] ease-linear ${i === current ? "scale-110" : "scale-100"}`}
              priority={i === 0}
            />
          </div>
        )) : (
          <Image src="/banner.jpg" alt="Masjid Banner" fill className="object-cover" priority />
        )}



        {/* Gradient overlay */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        {/* Prev/Next arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => goTo((current - 1 + slides.length) % slides.length)}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-40 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#d4a017]/80 border border-white/20 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => goTo((current + 1) % slides.length)}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#d4a017]/80 border border-white/20 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}

        {/* Floating orbs */}
        <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden">
          <Orb x="8%"  y="20%" size={60}  delay={0}   color="rgba(212,160,23,0.25)" />
          <Orb x="80%" y="10%" size={90}  delay={1.2} color="rgba(26,122,74,0.2)" />
          <Orb x="60%" y="60%" size={50}  delay={2.1} color="rgba(212,160,23,0.15)" />
          <Orb x="20%" y="70%" size={40}  delay={0.7} color="rgba(255,255,255,0.1)" />
          <Orb x="90%" y="50%" size={70}  delay={1.8} color="rgba(26,122,74,0.15)" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
          {/* Bismillah */}
          <p className="text-[#d4a017] text-sm sm:text-base lg:text-lg font-medium mb-1 sm:mb-2 drop-shadow-lg tracking-widest">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          {/* Gold divider */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="h-px w-6 sm:w-10 bg-[#d4a017]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4a017]" />
            <div className="h-px w-6 sm:w-10 bg-[#d4a017]" />
          </div>

          {/* Masjid name */}
          <h1 className="text-white text-xl sm:text-3xl lg:text-4xl font-bold drop-shadow-xl leading-tight mb-1 sm:mb-2 line-clamp-2">
            {title}
          </h1>

          {/* Tagline */}
          <p className="text-gray-300 text-xs sm:text-sm lg:text-base italic mb-3 sm:mb-4 line-clamp-1">
            &ldquo;{tagline}&rdquo;
          </p>

          {/* CTA + dots */}
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/donate"
              className="relative inline-flex items-center gap-1.5 bg-[#d4a017] hover:bg-[#b8891a] text-white text-xs sm:text-sm font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#d4a017]/40 hover:shadow-xl overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
              {lang === "bn" ? "দান করুন" : "Donate Now"}
            </Link>
            </motion.div>

            {slides.length > 1 && (
              <div className="flex gap-1.5 items-center">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-2 bg-[#d4a017]" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
                  />
                ))}
              </div>
            )}
          </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
    </div>
  );
}
