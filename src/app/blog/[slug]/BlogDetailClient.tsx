"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import ShareButton from "@/components/ui/ShareButton";
import api from "@/lib/axios";
import { BlogPost } from "@/types";
import { useLang } from "@/lib/LangContext";
import Navbar from "@/components/home/Navbar";
import { Footer } from "@/components/home/BottomSections";

const CATEGORY_IMAGES: Record<string, string> = {
  Prayer:    "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80",
  Ramadan:   "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80",
  Charity:   "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
  Quran:     "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80",
  Hajj:      "https://images.unsplash.com/photo-1519058082700-08a515d26aa9?w=800&q=80",
  Etiquette: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80",
  default:   "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80",
};

const demoPosts: BlogPost[] = [
  { _id: "1", isActive: true, date: "2024-11-10",
    category: { en: "Prayer", bn: "নামাজ" },
    title: { en: "The Importance of Fajr Prayer in a Muslim's Life", bn: "একজন মুসলিমের জীবনে ফজর নামাজের গুরুত্ব" },
    description: { en: "Fajr prayer is the first of the five daily prayers and holds a special place in Islam.\n\nThe Prophet Muhammad (PBUH) said: 'Whoever prays Fajr is under the protection of Allah.' Rising before dawn to pray is a powerful act of devotion that sets the tone for the entire day.\n\nThe spiritual benefits of Fajr are immense. It connects the believer to Allah at the most peaceful time of day, before the world awakens and distractions begin.\n\nPractically, waking up for Fajr instills discipline, time management, and a sense of purpose.", bn: "ফজর নামাজ পাঁচ ওয়াক্ত নামাজের মধ্যে প্রথম এবং ইসলামে এর বিশেষ স্থান রয়েছে।\n\nহযরত মুহাম্মদ (সাঃ) বলেছেন: 'যে ব্যক্তি ফজরের নামাজ আদায় করে, সে আল্লাহর আশ্রয়ে থাকে।'\n\nফজরের আধ্যাত্মিক উপকারিতা অপরিসীম। এটি মুমিনকে দিনের সবচেয়ে শান্তিপূর্ণ সময়ে আল্লাহর সাথে সংযুক্ত করে।" },
    author: { en: "Imam Abdur Rahman", bn: "ইমাম আব্দুর রহমান" }, createdAt: "2024-11-10T06:00:00Z" },
  { _id: "2", isActive: true, date: "2024-10-25",
    category: { en: "Ramadan", bn: "রমজান" },
    title: { en: "How to Prepare Spiritually for Ramadan", bn: "রমজানের জন্য আধ্যাত্মিকভাবে কীভাবে প্রস্তুতি নেবেন" },
    description: { en: "Ramadan is the holiest month in the Islamic calendar. Preparing your heart and mind before it arrives can transform your entire experience.\n\nStart by increasing your Quran recitation. Make a list of duas you want to focus on.\n\nReduce distractions gradually so that when Ramadan arrives, your heart is already inclined toward worship.", bn: "রমজান ইসলামিক ক্যালেন্ডারের সবচেয়ে পবিত্র মাস।\n\nরমজানের আগের সপ্তাহগুলোতে কুরআন তেলাওয়াত বাড়িয়ে শুরু করুন।\n\nধীরে ধীরে বিক্ষেপ কমিয়ে আনুন।" },
    author: { en: "Maulana Yusuf Ali", bn: "মাওলানা ইউসুফ আলী" }, createdAt: "2024-10-25T08:00:00Z" },
  { _id: "3", isActive: true, date: "2024-10-15",
    category: { en: "Charity", bn: "দান" },
    title: { en: "The Blessings of Sadaqah: Giving in the Way of Allah", bn: "সদকার বরকত: আল্লাহর পথে দান করা" },
    description: { en: "Sadaqah is voluntary charity given for the sake of Allah. Its rewards extend beyond this world.\n\nThe Prophet (PBUH) said: 'Charity does not decrease wealth.' Every act of giving is recorded and rewarded by Allah.\n\nSadaqah can take many forms — money, food, a smile, or removing something harmful from the road.", bn: "সদকা হলো আল্লাহর সন্তুষ্টির জন্য স্বেচ্ছায় দান।\n\nনবী (সাঃ) বলেছেন: 'দান-সদকা সম্পদ কমায় না।'\n\nসদকা অনেক রূপে হতে পারে — অর্থ, খাবার, হাসি বা রাস্তা থেকে ক্ষতিকর কিছু সরিয়ে দেওয়া।" },
    author: { en: "Hafez Md. Yusuf", bn: "হাফেজ মোঃ ইউসুফ" }, createdAt: "2024-10-15T09:00:00Z" },
  { _id: "4", isActive: true, date: "2024-10-05",
    category: { en: "Etiquette", bn: "আদব" },
    title: { en: "Masjid Etiquette Every Muslim Should Know", bn: "প্রতিটি মুসলিমের জানা উচিত মসজিদের আদব" },
    description: { en: "The masjid is the house of Allah. Observing proper etiquette when entering is an act of worship.\n\nEnter with the right foot and recite the dua. Lower your voice inside the masjid.\n\nMaintain cleanliness and ensure you are in a state of wudu.", bn: "মসজিদ আল্লাহর ঘর। প্রবেশের সময় সঠিক আদব মেনে চলা নিজেই একটি ইবাদত।\n\nডান পা দিয়ে প্রবেশ করুন এবং দোয়া পড়ুন।\n\nপরিষ্কার-পরিচ্ছন্নতা বজায় রাখুন।" },
    author: { en: "Imam Abdur Rahman", bn: "ইমাম আব্দুর রহমান" }, createdAt: "2024-10-05T07:00:00Z" },
  { _id: "5", isActive: true, date: "2024-09-28",
    category: { en: "Quran", bn: "কুরআন" },
    title: { en: "The Art of Beautiful Quran Recitation", bn: "সুন্দর কুরআন তেলাওয়াতের শিল্প" },
    description: { en: "Tajweed is the set of rules governing how the words of the Quran should be pronounced during recitation.\n\nBegin by learning the Arabic alphabet and the makharij of each letter. Then study the rules of noon sakinah, meem sakinah, and madd.\n\nListening to renowned reciters can greatly help in developing a beautiful recitation style.", bn: "তাজবীদ হলো সেই নিয়মের সমষ্টি যা তেলাওয়াতের সময় কুরআনের শব্দগুলো কীভাবে উচ্চারণ করতে হবে তা নির্ধারণ করে।\n\nআরবি বর্ণমালা এবং প্রতিটি হরফের মাখরাজ শেখার মাধ্যমে শুরু করুন।" },
    author: { en: "Qari Ahmed Hassan", bn: "কারী আহমেদ হাসান" }, createdAt: "2024-09-28T10:00:00Z" },
  { _id: "6", isActive: true, date: "2024-09-15",
    category: { en: "Hajj", bn: "হজ" },
    title: { en: "Preparing for the Sacred Journey of Hajj", bn: "হজের পবিত্র যাত্রার প্রস্তুতি" },
    description: { en: "Hajj is one of the five pillars of Islam and is obligatory for every able Muslim.\n\nPhysical preparation: Begin a walking routine months in advance and ensure vaccinations are up to date.\n\nSpiritual preparation: Learn the rituals in detail — Tawaf, Sa'i, standing at Arafah, and the stoning of the Jamarat.", bn: "হজ ইসলামের পাঁচটি স্তম্ভের একটি।\n\nশারীরিক প্রস্তুতি: কয়েক মাস আগে থেকেই হাঁটার অভ্যাস শুরু করুন।\n\nআধ্যাত্মিক প্রস্তুতি: হজের আচার-অনুষ্ঠানগুলো বিস্তারিতভাবে শিখুন।" },
    author: { en: "Maulana Yusuf Ali", bn: "মাওলানা ইউসুফ আলী" }, createdAt: "2024-09-15T08:30:00Z" },
];

export default function BlogDetailClient() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLang();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["blog", slug],
    queryFn: () => api.get(`/blog/${slug}`).then((r) => r.data.data),
    enabled: !!slug,
  });

  const resolved = post ?? demoPosts.find((p) => p._id === slug);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-b from-white to-[#f8fdf9]">
        <div className="max-w-7xl mx-auto px-4 py-12">

          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[#1a7a4a] font-medium hover:underline mb-8">
            <ArrowLeft size={15} />
            {lang === "bn" ? "সকল নিবন্ধ" : "All Articles"}
          </Link>

          {isLoading && (
            <div className="animate-pulse space-y-6">
              <div className="h-72 bg-gray-200 rounded-3xl" />
              <div className="h-6 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
              </div>
            </div>
          )}

          {!isLoading && resolved && (
            <article>
              <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden mb-8 shadow-lg">
                <Image
                  src={resolved.imageUrl || CATEGORY_IMAGES[resolved.category.en] || CATEGORY_IMAGES.default}
                  alt={resolved.title.en}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <span className="absolute top-5 left-5 bg-[#d4a017] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  <Tag size={11} className="inline mr-1" />
                  {lang === "bn" ? resolved.category.bn : resolved.category.en}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-5">
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-[#1a7a4a]" />
                  {new Date(resolved.createdAt).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={15} className="text-[#1a7a4a]" />
                  {lang === "bn" ? resolved.author.bn : resolved.author.en}
                </span>
                <ShareButton url={`/blog/${slug}`} title={lang === "bn" ? resolved.title.bn : resolved.title.en} className="ml-auto" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
                {lang === "bn" ? resolved.title.bn : resolved.title.en}
              </h1>

              <div className="w-16 h-1 bg-[#d4a017] rounded-full mb-8" />

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {lang === "bn" ? resolved.description.bn : resolved.description.en}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 bg-[#1a7a4a] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#155f3a] transition-all shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft size={16} />
                  {lang === "bn" ? "সকল নিবন্ধে ফিরুন" : "Back to All Articles"}
                </Link>
              </div>
            </article>
          )}

          {!isLoading && !resolved && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">{lang === "bn" ? "নিবন্ধটি পাওয়া যায়নি।" : "Article not found."}</p>
              <Link href="/blog" className="mt-4 inline-block text-[#1a7a4a] font-medium hover:underline">
                {lang === "bn" ? "সকল নিবন্ধ দেখুন" : "View all articles"}
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
