"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Calendar, User, ArrowRight, Search } from "lucide-react";
import api from "@/lib/axios";
import { BlogPost } from "@/types";
import { useLang } from "@/lib/LangContext";
import Navbar from "@/components/home/Navbar";
import { Footer } from "@/components/home/BottomSections";

const CATEGORY_IMAGES: Record<string, string> = {
  Prayer:    "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&q=80",
  Ramadan:   "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&q=80",
  Charity:   "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
  Quran:     "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&q=80",
  Hajj:      "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&q=80",
  Etiquette: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&q=80",
  default:   "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&q=80",
};

const demoPosts: BlogPost[] = [
  { _id: "1", imageUrl: undefined, isActive: true,
    category: { en: "Prayer", bn: "নামাজ" },
    title: { en: "The Importance of Fajr Prayer in a Muslim's Life", bn: "একজন মুসলিমের জীবনে ফজর নামাজের গুরুত্ব" },
    description: { en: "Fajr prayer is the first of the five daily prayers and holds a special place in Islam. The Prophet Muhammad (PBUH) said: 'Whoever prays Fajr is under the protection of Allah.'", bn: "ফজর নামাজ পাঁচ ওয়াক্ত নামাজের মধ্যে প্রথম এবং ইসলামে এর বিশেষ স্থান রয়েছে। হযরত মুহাম্মদ (সাঃ) বলেছেন: 'যে ব্যক্তি ফজরের নামাজ আদায় করে, সে আল্লাহর আশ্রয়ে থাকে।'" },
    author: { en: "Imam Abdur Rahman", bn: "ইমাম আব্দুর রহমান" }, date: "2024-11-10", createdAt: "2024-11-10T06:00:00Z" },
  { _id: "2", imageUrl: undefined, isActive: true,
    category: { en: "Ramadan", bn: "রমজান" },
    title: { en: "How to Prepare Spiritually for Ramadan", bn: "রমজানের জন্য আধ্যাত্মিকভাবে কীভাবে প্রস্তুতি নেবেন" },
    description: { en: "Ramadan is the holiest month in the Islamic calendar. Preparing your heart and mind before it arrives can transform your entire experience.", bn: "রমজান ইসলামিক ক্যালেন্ডারের সবচেয়ে পবিত্র মাস। এটি আসার আগে আপনার হৃদয় ও মনকে প্রস্তুত করলে পুরো অভিজ্ঞতাটি রূপান্তরিত হতে পারে।" },
    author: { en: "Maulana Yusuf Ali", bn: "মাওলানা ইউসুফ আলী" }, date: "2024-10-25", createdAt: "2024-10-25T08:00:00Z" },
  { _id: "3", imageUrl: undefined, isActive: true,
    category: { en: "Charity", bn: "দান" },
    title: { en: "The Blessings of Sadaqah: Giving in the Way of Allah", bn: "সদকার বরকত: আল্লাহর পথে দান করা" },
    description: { en: "Sadaqah is voluntary charity given for the sake of Allah. Its rewards extend beyond this world. The Prophet (PBUH) said: 'Charity does not decrease wealth.'", bn: "সদকা হলো আল্লাহর সন্তুষ্টির জন্য স্বেচ্ছায় দান। এর পুরস্কার এই দুনিয়ার বাইরেও বিস্তৃত।" },
    author: { en: "Hafez Md. Yusuf", bn: "হাফেজ মোঃ ইউসুফ" }, date: "2024-10-15", createdAt: "2024-10-15T09:00:00Z" },
  { _id: "4", imageUrl: undefined, isActive: true,
    category: { en: "Etiquette", bn: "আদব" },
    title: { en: "Masjid Etiquette Every Muslim Should Know", bn: "প্রতিটি মুসলিমের জানা উচিত মসজিদের আদব" },
    description: { en: "The masjid is the house of Allah. Observing proper etiquette when entering is an act of worship. Enter with the right foot and recite the dua.", bn: "মসজিদ আল্লাহর ঘর। প্রবেশের সময় সঠিক আদব মেনে চলা নিজেই একটি ইবাদত।" },
    author: { en: "Imam Abdur Rahman", bn: "ইমাম আব্দুর রহমান" }, date: "2024-10-05", createdAt: "2024-10-05T07:00:00Z" },
  { _id: "5", imageUrl: undefined, isActive: true,
    category: { en: "Quran", bn: "কুরআন" },
    title: { en: "The Art of Beautiful Quran Recitation", bn: "সুন্দর কুরআন তেলাওয়াতের শিল্প" },
    description: { en: "Learn the principles of Tajweed and how to recite the Quran with proper pronunciation. Tajweed means giving each letter its right characteristics.", bn: "তাজবীদের নীতি এবং সঠিক উচ্চারণে কুরআন তেলাওয়াত শিখুন।" },
    author: { en: "Qari Ahmed Hassan", bn: "কারী আহমেদ হাসান" }, date: "2024-09-28", createdAt: "2024-09-28T10:00:00Z" },
  { _id: "6", imageUrl: undefined, isActive: true,
    category: { en: "Hajj", bn: "হজ" },
    title: { en: "Preparing for the Sacred Journey of Hajj", bn: "হজের পবিত্র যাত্রার প্রস্তুতি" },
    description: { en: "A comprehensive guide to preparing physically, spiritually, and financially for Hajj — one of the five pillars of Islam.", bn: "হজের জন্য শারীরিক, আধ্যাত্মিক এবং আর্থিকভাবে প্রস্তুতির একটি সম্পূর্ণ গাইড।" },
    author: { en: "Maulana Yusuf Ali", bn: "মাওলানা ইউসুফ আলী" }, date: "2024-09-15", createdAt: "2024-09-15T08:30:00Z" },
];

const categories = [
  { en: "All", bn: "সব" },
  { en: "Prayer", bn: "নামাজ" },
  { en: "Ramadan", bn: "রমজান" },
  { en: "Charity", bn: "দান" },
  { en: "Quran", bn: "কুরআন" },
  { en: "Hajj", bn: "হজ" },
  { en: "Etiquette", bn: "আদব" },
];

export default function BlogPage() {
  const { lang } = useLang();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog-all"],
    queryFn: () => api.get("/blog?limit=100&isActive=true").then((r) => r.data.data?.data ?? r.data.data),
  });

  const list = posts.length > 0 ? posts : demoPosts;

  const filtered = list
    .filter((p) => activeCategory === "All" || p.category.en === activeCategory)
    .filter((p) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return p.title.en.toLowerCase().includes(q) || p.title.bn.toLowerCase().includes(q);
    });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-b from-white to-[#f8fdf9]">
        <div className="container mx-auto px-4 py-12">

          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {lang === "bn" ? "সকল নিবন্ধ" : "All Articles"}
                </h1>
                <p className="text-gray-500">
                  {lang === "bn" ? "ইসলামিক শিক্ষা ও আধ্যাত্মিকতা সম্পর্কে নির্দেশনা" : "Guidance on Islamic teachings and spirituality"}
                </p>
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={lang === "bn" ? "খুঁজুন..." : "Search articles..."}
                  className="pl-9 pr-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-[#1a7a4a] w-64"
                />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.en}
                onClick={() => setActiveCategory(cat.en)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.en
                    ? "bg-[#1a7a4a] text-white shadow-lg shadow-[#1a7a4a]/30"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#1a7a4a] hover:text-[#1a7a4a]"
                }`}
              >
                {lang === "bn" ? cat.bn : cat.en}
              </button>
            ))}
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
              <p>{lang === "bn" ? "কোনো নিবন্ধ পাওয়া যায়নি।" : "No articles found."}</p>
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <>
              {/* Featured Post */}
              {activeCategory === "All" && !search && featured && (
                <Link
                  href={`/blog/${featured._id}`}
                  className="group block mb-12 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-72 lg:h-auto overflow-hidden">
                      <Image
                        src={featured.imageUrl || CATEGORY_IMAGES[featured.category.en] || CATEGORY_IMAGES.default}
                        alt={featured.title.en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                      <span className="absolute top-5 left-5 bg-[#d4a017] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        {lang === "bn" ? featured.category.bn : featured.category.en}
                      </span>
                      <span className="absolute top-5 right-5 bg-[#1a7a4a] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        {lang === "bn" ? "ফিচার্ড" : "Featured"}
                      </span>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Calendar size={13} />
                          {new Date(featured.createdAt).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1"><User size={13} />
                          {lang === "bn" ? featured.author.bn : featured.author.en}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1a7a4a] transition-colors leading-snug">
                        {lang === "bn" ? featured.title.bn : featured.title.en}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {lang === "bn" ? featured.description.bn : featured.description.en}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[#1a7a4a] font-semibold text-sm group-hover:gap-3 transition-all">
                        {lang === "bn" ? "আরও পড়ুন" : "Read Full Article"} <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(activeCategory === "All" && !search ? rest : filtered).map((post) => (
                  <article
                    key={post._id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#1a7a4a]/20 flex flex-col"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.imageUrl || CATEGORY_IMAGES[post.category.en] || CATEGORY_IMAGES.default}
                        alt={post.title.en}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 bg-[#d4a017] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {lang === "bn" ? post.category.bn : post.category.en}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><Calendar size={13} />
                          {new Date(post.createdAt).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1"><User size={13} />
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
                        {lang === "bn" ? "আরও পড়ুন" : "Read More"} <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
