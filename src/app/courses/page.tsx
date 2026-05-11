"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Navbar from "@/components/home/Navbar";
import { Footer } from "@/components/home/BottomSections";
import api from "@/lib/axios";
import { Course } from "@/types";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User } from "lucide-react";
import { useLang } from "@/lib/LangContext";

export default function CoursesPage() {
  const { lang } = useLang();

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["courses-all"],
    queryFn: () => api.get("/courses?status=active&limit=100").then((r) => r.data.data?.data ?? r.data.data),
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-linear-to-r from-[#1a7a4a] to-[#15633d] py-11">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a017] mb-2">
              {lang === "bn" ? "আমাদের কোর্সসমূহ" : "Our Courses"}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {lang === "bn" ? "ইসলামিক কোর্স" : "Islamic Education Courses"}
            </h1>
            <p className="text-white/80 text-md max-w-lg mx-auto">
              {lang === "bn"
                ? "পাঁচ তারা জামে মসজিদে পরিচালিত সকল সক্রিয় ইসলামিক কোর্স দেখুন এবং যোগ দিন।"
                : "Browse all active Islamic courses offered at Panch Tara Jame Masjid and join today."}
            </p>
          </div>
        </section>

        {/* Courses grid */}
        <section className="py-12 bg-[#f8f6f0]">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border animate-pulse">
                    <div className="h-44 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
                <p>{lang === "bn" ? "কোনো সক্রিয় কোর্স পাওয়া যায়নি।" : "No active courses found."}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((c) => (
                  <div key={c._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    {c.imageUrl ? (
                      <div className="relative h-44">
                        <Image src={c.imageUrl} alt={c.title.en} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-44 bg-[#e8f5ee] flex items-center justify-center">
                        <BookOpen size={36} className="text-[#1a7a4a]/30" />
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <Badge variant="outline" className="text-xs w-fit mb-2">
                        {lang === "bn" ? c.category.bn : c.category.en}
                      </Badge>
                      <p className="font-bold text-gray-800 text-sm leading-snug mb-1">
                        {lang === "bn" ? c.title.bn : c.title.en}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-3 mb-3 flex-1">
                        {lang === "bn" ? c.description.bn : c.description.en}
                      </p>
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <User size={12} className="text-[#1a7a4a]" />
                          {lang === "bn" ? c.teacher.name.bn : c.teacher.name.en}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
