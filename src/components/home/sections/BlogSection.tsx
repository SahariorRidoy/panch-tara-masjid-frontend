"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { BlogPost } from "@/types";
import { useLang } from "@/lib/LangContext";
import { useState } from "react";
import { Calendar, User, ArrowRight, ImageOff } from "lucide-react";
import { scaleIn } from "@/lib/animations";

const categories = [
  { en: "All",     bn: "সব" },
  { en: "Prayer",  bn: "নামাজ" },
  { en: "Ramadan", bn: "রমজান" },
  { en: "Sadaqah", bn: "সদকা" },
  { en: "Quran",   bn: "কুরআন" },
  { en: "Hajj",    bn: "হজ" },
];

export function BlogSection() {
  const { lang } = useLang();
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog-home"],
    queryFn: () => api.get("/blog?limit=6&isActive=true").then((r) => r.data.data?.data ?? r.data.data),
    staleTime: 60_000,
  });

  const filtered = activeCategory === "All"
    ? posts
    : posts.filter((p) => p.category?.en === activeCategory);

  return (
    <section id="blog" className="relative py-20 bg-[#f8f6f0] overflow-hidden">
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
            {lang === "bn" ? "সাম্প্রতিক নিবন্ধ" : "Latest Articles"}
          </h2>
          <p className="text-gray-600 max-w-2xl">
            {lang === "bn"
              ? "ইসলামিক শিক্ষা, জীবনযাপন এবং আধ্যাত্মিকতা সম্পর্কে অন্তর্দৃষ্টি এবং নির্দেশনা"
              : "Insights and guidance on Islamic teachings, lifestyle, and spirituality"}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap gap-3 mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.en}
              onClick={() => setActiveCategory(cat.en)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.en
                  ? "bg-[#1a7a4a] text-white shadow-lg shadow-[#1a7a4a]/30"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#1a7a4a] hover:text-[#1a7a4a]"
              }`}
            >
              {lang === "bn" ? cat.bn : cat.en}
            </motion.button>
          ))}
        </motion.div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-56 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && (
          <>
            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-16">
                {lang === "bn" ? "কোনো নিবন্ধ পাওয়া যায়নি" : "No articles found"}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                {filtered.slice(0, 6).map((post, idx) => (
                  <motion.article
                    key={post._id}
                    variants={scaleIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    custom={idx}
                    whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(26,122,74,0.12)" }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-[#1a7a4a]/20 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title.en}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageOff size={36} className="text-gray-300" />
                        </div>
                      )}
                      {post.category?.en && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#d4a017] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {lang === "bn" ? post.category.bn : post.category.en}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(post.date ?? post.createdAt).toLocaleDateString(
                            lang === "bn" ? "bn-BD" : "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <User size={14} />
                          {lang === "bn" ? post.author.bn : post.author.en}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1a7a4a] transition-colors">
                        {lang === "bn" ? post.title.bn : post.title.en}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                        {lang === "bn" ? post.description.bn : post.description.en}
                      </p>

                      <Link
                        href={`/blog/${post._id}`}
                        className="inline-flex items-center gap-2 text-[#1a7a4a] font-semibold text-sm group-hover:gap-3 transition-all"
                      >
                        {lang === "bn" ? "আরও পড়ুন" : "Read More"}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}

        {/* View All */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-[#1a7a4a] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#155f3a] transition-all shadow-lg hover:shadow-xl"
            >
              {lang === "bn" ? "সব নিবন্ধ দেখুন" : "View All Articles"}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
