"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Heart, Users, HandCoins, Moon } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { scaleIn } from "@/lib/animations";

const services = [
  {
    icon: BookOpen,
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    en: { title: "Quran Education", tag: "Daily Classes", desc: "From beginner Nazera to advanced Hifz and Tajweed — structured Quran learning for children, youth, and adults under qualified teachers." },
    bn: { title: "কুরআন শিক্ষা", tag: "প্রতিদিনের ক্লাস", desc: "নাজেরা থেকে হিফজ ও তাজবিদ পর্যন্ত — যোগ্য শিক্ষকদের তত্ত্বাবধানে শিশু, কিশোর ও বয়স্কদের জন্য কুরআন শিক্ষার সুব্যবস্থা।" },
  },
  {
    icon: GraduationCap,
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    en: { title: "Islamic Studies", tag: "Structured Courses", desc: "In-depth courses covering Fiqh, Hadith, Aqeedah, and Islamic history — building a strong foundation of knowledge for every Muslim." },
    bn: { title: "ইসলামিক শিক্ষা", tag: "কাঠামোবদ্ধ কোর্স", desc: "ফিকহ, হাদিস, আকিদা ও ইসলামের ইতিহাস বিষয়ক গভীর কোর্স — প্রতিটি মুসলিমের জন্য জ্ঞানের মজবুত ভিত্তি গড়ে তোলা।" },
  },
  {
    icon: Heart,
    gradient: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    en: { title: "Funeral & Welfare", tag: "Community Care", desc: "Compassionate Janazah prayer, ghusl, and burial arrangements — ensuring every member of our community is honoured with dignity." },
    bn: { title: "জানাজা ও কল্যাণ সেবা", tag: "সামাজিক সেবা", desc: "সহানুভূতির সাথে জানাজা নামাজ, গোসল ও দাফনের ব্যবস্থা — সম্প্রদায়ের প্রতিটি সদস্যকে মর্যাদার সাথে বিদায় জানানো।" },
  },
  {
    icon: HandCoins,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    en: { title: "Zakat & Sadaqah", tag: "Transparent Giving", desc: "A trusted system for collecting and distributing Zakat, Fitrah, and voluntary charity — reaching those most in need within the community." },
    bn: { title: "জাকাত ও সদকা", tag: "স্বচ্ছ বিতরণ", desc: "জাকাত, ফিতরা ও স্বেচ্ছামূলক দান সংগ্রহ ও বিতরণের বিশ্বস্ত ব্যবস্থা — সম্প্রদায়ের সবচেয়ে অসহায়দের কাছে পৌঁছানো।" },
  },
  {
    icon: Users,
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    en: { title: "Community Support", tag: "Counselling & Mediation", desc: "Guidance, conflict resolution, and welfare support for families and individuals — strengthening the bonds of our community." },
    bn: { title: "সামাজিক সহায়তা", tag: "পরামর্শ ও মধ্যস্থতা", desc: "পরিবার ও ব্যক্তির জন্য পরামর্শ, বিরোধ নিষ্পত্তি ও কল্যাণ সহায়তা — সম্প্রদায়ের বন্ধন মজবুত করা।" },
  },
  {
    icon: Moon,
    gradient: "from-cyan-500 to-sky-600",
    bg: "bg-cyan-50",
    en: { title: "Ramadan Programs", tag: "Special Events", desc: "Tarawih prayers, community Iftar, Laylatul Qadr vigils, and Eid celebrations — making every blessed moment spiritually meaningful." },
    bn: { title: "রমজান কার্যক্রম", tag: "বিশেষ আয়োজন", desc: "তারাবিহ নামাজ, সম্মিলিত ইফতার, লাইলাতুল কদর ও ঈদ উদযাপন — প্রতিটি বরকতময় মুহূর্তকে আধ্যাত্মিকভাবে অর্থবহ করা।" },
  },
];

export function CoursesSection() {
  const { lang } = useLang();

  return (
    <section id="courses" className="relative bg-[#ffffff] overflow-hidden">
      <div className="absolute inset-0 pattern-geometric" />

      {/* Dark header band */}
      <div className="relative z-10 bg-[#0f2d1f] py-6 px-4 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#d4a017]/10 rounded-full animate-float-slow" />
        <div className="absolute -bottom-8 left-10 w-32 h-32 bg-[#1a7a4a]/20 rounded-full animate-float-delay" />
        <motion.div
          className="relative z-10 container mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-md font-semibold uppercase tracking-widest text-[#d4a017] mb-3">
            {lang === "bn" ? "আমাদের সেবাসমূহ" : "Our Services"}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug mb-5">
            {lang === "bn"
              ? "একটি মসজিদ যা সম্প্রদায়ের জন্য সর্বদা উন্মুক্ত"
              : "A Masjid That Serves Its Community Every Day"}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            {lang === "bn"
              ? "পাঁচ তারা জামে মসজিদ শুধু নামাজের স্থান নয় — এটি শিক্ষা, আধ্যাত্মিক উন্নয়ন, সামাজিক কল্যাণ ও দাওয়াহর একটি পূর্ণাঙ্গ কেন্দ্র। জন্ম থেকে মৃত্যু পর্যন্ত, আমরা আপনার পাশে আছি।"
              : "Panch Tara Jame Masjid is more than a place of prayer — it is a complete centre for education, spiritual growth, social welfare, and dawah. From birth to death, we are here for every member of our community."}
          </p>
        </motion.div>
      </div>

      {/* Service cards */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            const item = lang === "bn" ? s.bn : s.en;
            return (
              <motion.div
                key={i}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                custom={i}
                whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(0,0,0,0.12)" }}
                className="group relative bg-white rounded-2xl border border-gray-100 p-6 overflow-hidden cursor-default"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-linear-to-br ${s.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                  <div className={`bg-linear-to-br ${s.gradient} w-8 h-8 rounded-lg flex items-center justify-center`}>
                    <Icon size={16} className="text-white" />
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1 block">
                  {item.tag}
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/courses"
            className="inline-block bg-[#1a7a4a] hover:bg-[#155f3a] text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors"
          >
            {lang === "bn" ? "আমাদের কোর্সগুলো দেখুন →" : "Explore Our Courses →"}
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            {lang === "bn"
              ? "আরও বিস্তারিত জানতে বা নিবন্ধন করতে আমাদের সাথে যোগাযোগ করুন।"
              : "Contact us to learn more or to register for any of our programmes."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
