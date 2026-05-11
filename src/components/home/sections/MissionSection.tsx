"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/LangContext";
import { Target, BookOpen, Users, Heart, Shield, Lightbulb, CheckCircle2 } from "lucide-react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const objectives = [
  { icon: Shield, en: "Ensure a beautiful and spacious worship environment for all musallees", bn: "মুসল্লিদের জন্য সুন্দর ও প্রশস্ত ইবাদতের পরিবেশ নিশ্চিত করা" },
  { icon: Heart, en: "Ensure a safe and comfortable worship space for women and children", bn: "মহিলা ও শিশুদের জন্য সুন্দর ও নিরাপদ ইবাদতের পরিবেশ নিশ্চিত করা" },
  { icon: BookOpen, en: "Spread Islamic education based on the Quran and Sunnah", bn: "কুরআন ও সুন্নাহভিত্তিক ইসলামী শিক্ষা বিস্তার করা" },
  { icon: Lightbulb, en: "Inspire children, youth, and adults towards Islamic learning", bn: "শিশু, কিশোর, তরুণ ও বয়স্কদের দ্বীনি শিক্ষায় উদ্বুদ্ধ করা" },
  { icon: Users, en: "Promote unity, morality, and cooperation in society", bn: "সমাজে ঐক্য, নৈতিকতা ও সহযোগিতা বৃদ্ধি করা" },
  { icon: Target, en: "Spread the correct teachings of Islam throughout the community", bn: "ইসলামের সঠিক শিক্ষা সমাজে ছড়িয়ে দেওয়া" },
];

const facilities = [
  { en: "Separate spacious prayer halls for men and women", bn: "নারী ও পুরুষদের জন্য আলাদা প্রশস্ত নামাজের হল" },
  { en: "Modern ablution (wudu) facilities", bn: "আধুনিক অজুখানা" },
  { en: "Accommodation for Imam and staff", bn: "ইমাম ও খাদেমদের থাকার ব্যবস্থা" },
  { en: "Quran Education Centre (Maktab)", bn: "কুরআন শিক্ষা কেন্দ্র (মক্তব)" },
  { en: "Islamic Library & Lillah Boarding", bn: "ইসলামী লাইব্রেরি ও লিল্লাহ বোর্ডিং" },
  { en: "Islamic seminar and discussion hall", bn: "দ্বীনি আলোচনা ও সেমিনার কক্ষ" },
  { en: "Community welfare activity centre", bn: "সমাজকল্যাণমূলক কার্যক্রম পরিচালনার স্থান" },
];

export function MissionSection() {
  const { lang } = useLang();

  return (
    <section className="relative py-20 bg-[#f8f6f0] overflow-hidden">
      <div className="absolute inset-0 pattern-geometric" />
      <div className="relative z-10 container mx-auto px-4">

        {/* Top Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-md font-semibold uppercase tracking-widest text-[#d4a017] mb-2">
            {lang === "bn" ? "আমাদের লক্ষ্য ও প্রকল্প" : "Our Vision & Project"}
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {lang === "bn" ? "একটি আদর্শ ইসলামী কেন্দ্র গড়ে তোলা" : "Building an Ideal Islamic Centre"}
          </h2>
          <p className="text-[#d4a017] font-arabic text-xl mb-1">
            إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ
          </p>
          <p className="text-xs text-gray-400">{lang === "bn" ? "— সূরা আত-তাওবাহ: ১৮" : "— Surah At-Tawbah: 18"}</p>
        </motion.div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* COL 1 — Mission & Objectives */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full flex flex-col gap-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a017] mb-1">
                {lang === "bn" ? "আমাদের উদ্দেশ্য" : "Our Objectives"}
              </p>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {lang === "bn" ? "আমরা যা করতে চাই" : "What We Aim to Achieve"}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {lang === "bn"
                  ? "নয়াবাড়ি পাঁচ তারা জামে মসজিদ কমপ্লেক্সকে একটি আদর্শ ইসলামী কেন্দ্র হিসেবে গড়ে তোলা, যেখানে ইবাদত, শিক্ষা, দাওয়াহ এবং সামাজিক কল্যাণমূলক কার্যক্রম একত্রে পরিচালিত হবে।"
                  : "To develop Nayabari Panch Tara Jame Masjid Complex as an ideal Islamic centre where worship, education, dawah, and social welfare activities are conducted together."}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {objectives.map((obj, i) => {
                const Icon = obj.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className="flex items-start gap-3 bg-[#f8f6f0] rounded-xl p-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#1a7a4a]/10 flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-[#1a7a4a]" />
                    </div>
                    <p className="text-xs text-gray-700 leading-snug">{lang === "bn" ? obj.bn : obj.en}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* COL 2 — Masjid Model Image */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-90 h-130 rounded-2xl overflow-hidden shadow-lg">
              <Image src="/model2.jpg" alt="Masjid Complex Model" fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-bold text-lg leading-tight mb-1">
                  {lang === "bn" ? "আধুনিক ৫ তলা মসজিদ কমপ্লেক্স" : "Modern 5-Storey Masjid Complex"}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#1a7a4a] animate-pulse" />
                  <span className="text-white/80 text-xs font-medium">
                    {lang === "bn" ? "নির্মাণ চলমান" : "Under Construction"}
                  </span>
                </div>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/donate"
                className="block w-full text-center bg-[#1a7a4a] hover:bg-[#155f3a] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
              >
                {lang === "bn" ? "এখনই দান করুন" : "Donate Now"}
              </Link>
            </motion.div>
          </motion.div>

          {/* COL 3 — Planned Facilities */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full flex flex-col gap-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a017] mb-1">
                {lang === "bn" ? "নির্মাণ প্রকল্প" : "Construction Project"}
              </p>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {lang === "bn" ? "এই কমপ্লেক্সে যা থাকবে" : "What This Complex Will Include"}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {lang === "bn"
                  ? "নয়াবাড়ি পাঁচ তারা জামে মসজিদকে একটি পূর্ণাঙ্গ ইসলামী কেন্দ্রে রূপান্তরের কাজ চলমান রয়েছে।"
                  : "The transformation of Nayabari Panch Tara Jame Masjid into a complete Islamic centre is currently underway."}
              </p>
            </div>
            <div className="space-y-3 flex-1">
              {facilities.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 size={16} className="text-[#1a7a4a] shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{lang === "bn" ? f.bn : f.en}</p>
                </motion.div>
              ))}
            </div>
            <div className="bg-[#1a7a4a]/10 border border-[#1a7a4a]/30 rounded-xl p-4 flex items-start gap-3 mt-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1a7a4a] animate-pulse shrink-0 mt-1" />
              <p className="text-xs text-[#1a7a4a] font-semibold leading-relaxed">
                {lang === "bn"
                  ? "নির্মাণ কাজ বর্তমানে চলমান রয়েছে — আপনার দান এই স্বপ্নকে বাস্তবে রূপ দিতে পারে।"
                  : "Construction is currently in progress — your donation can turn this dream into reality."}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
