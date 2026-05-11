"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Navbar from "@/components/home/Navbar";
import { Footer } from "@/components/home/BottomSections";
import { MapPin, Phone, Mail, Globe, CheckCircle2, Star, BookOpen, Heart, Users } from "lucide-react";
import api from "@/lib/axios";
import { ContactInfo } from "@/types";

const features = [
  "শান্তিপূর্ণ ইবাদতের পরিবেশ",
  "কুরআন শিক্ষা ও ইসলামী জ্ঞানের কেন্দ্র",
  "তরুণ প্রজন্মের নৈতিক শিক্ষার প্রতিষ্ঠান",
  "সমাজকল্যাণমূলক কার্যক্রমের কেন্দ্র",
];

const objectives = [
  "মুসল্লিদের জন্য সুন্দর ও প্রশস্ত ইবাদতের পরিবেশ নিশ্চিত করা",
  "মহিলা ও শিশুদের জন্য সুন্দর ও নিরাপদ ইবাদতের পরিবেশ নিশ্চিত করা",
  "কুরআন ও সুন্নাহভিত্তিক ইসলামী শিক্ষা বিস্তার করা",
  "শিশু, কিশোর, তরুণ ও বয়স্কদের দ্বীনি শিক্ষায় উদ্বুদ্ধ করা",
  "সমাজে ঐক্য, নৈতিকতা ও সহযোগিতা বৃদ্ধি করা",
  "ইসলামের সঠিক শিক্ষা সমাজে ছড়িয়ে দেওয়া",
];

const facilities = [
  { icon: <Users size={20} />, text: "নারী ও পুরুষদের জন্য আলাদা প্রশস্ত নামাজের হল" },
  { icon: <Star size={20} />, text: "আধুনিক অজুখানা" },
  { icon: <Heart size={20} />, text: "ইমাম ও খাদেমদের থাকার ব্যবস্থা" },
  { icon: <BookOpen size={20} />, text: "কুরআন শিক্ষা কেন্দ্র (মক্তব)" },
  { icon: <BookOpen size={20} />, text: "ইসলামী লাইব্রেরি ও লিল্লাহ বোর্ডিং" },
  { icon: <Users size={20} />, text: "দ্বীনি আলোচনা ও সেমিনার কক্ষ" },
  { icon: <Heart size={20} />, text: "সমাজকল্যাণমূলক কার্যক্রম পরিচালনার স্থান" },
];

const donationOptions = [
  "একটি ইট",
  "একটি জানালা",
  "একটি জায়নামাজের স্থান",
  "একটি তলার নির্মাণে অংশগ্রহণ",
];

export default function AboutPage() {
  const { data: contact } = useQuery<ContactInfo>({
    queryKey: ["contact"],
    queryFn: () => api.get("/contact").then((r) => r.data.data),
  });

  return (
    <>
      <Navbar />
      <main className="bg-[#f8f6f0] min-h-screen">

        {/* ── Hero ── */}
        <section className="relative bg-linear-to-r from-[#1a7a4a] to-[#15633d] overflow-hidden">
          {/* decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a7a4a]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d4a017]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative max-w-5xl mx-auto px-4 py-7 flex flex-col items-center text-center gap-5">
            {/* <Image src="/logo.jpg" alt="Logo" width={560} height={260} className="object-contain drop-shadow-2xl" /> */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-[#d4a017] text-[#d4a017]" />
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              নয়াবাড়ি পাঁচ তারা জামে মসজিদ কমপ্লেক্স
            </h1>
            <p className="text-[#d4a017] text-sm md:text-md italic max-w-2xl">
              ইবাদত, ঈমান ও ইসলামী শিক্ষার ও সমাজকল্যাণের এক অনন্য কেন্দ্র ও আলোকবর্তিকা
            </p>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <MapPin size={14} className="text-[#d4a017]" />
              <span>নয়াবাড়ি, সাভার, ঢাকা</span>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-14 space-y-12">

          {/* ── About ── */}
          <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
            <SectionTitle>আমাদের সম্পর্কে</SectionTitle>
            <p className="text-gray-600 leading-8 text-[15px] mt-4">
              ঢাকা–আরিচা মহাসড়কের পাশে সাহারা সিএনজি রিফুয়েলিং স্টেশন এন্ড সার্ভিসেস এর পিছনে নয়াবাড়ি এলাকায় অবস্থিত
              নয়াবাড়ি পাঁচ তারা জামে মসজিদ দীর্ঘদিন ধরে এলাকার মুসলিম সমাজের ধর্মীয় কার্যক্রমের অন্যতম কেন্দ্র হিসেবে
              গুরুত্বপূর্ণ ভূমিকা পালন করে আসছে। এই মসজিদ শুধুমাত্র পাঁচ ওয়াক্ত নামাজ আদায়ের স্থান নয়; বরং এটি মুসলিম
              সমাজের ঐক্য, দ্বীনি শিক্ষা এবং সামাজিক কল্যাণমূলক কার্যক্রমের এক প্রাণকেন্দ্র।
            </p>
            <p className="text-gray-600 leading-8 text-[15px] mt-3">
              সময়ের চাহিদা এবং মুসল্লিদের ক্রমবর্ধমান সংখ্যার কথা বিবেচনা করে বর্তমানে এই মসজিদকে একটি আধুনিক ৫ তলা
              বিশিষ্ট &ldquo;নয়াবাড়ি পাঁচ তারা জামে মসজিদ কমপ্লেক্স&rdquo; এ রূপান্তরের মহতী উদ্যোগ গ্রহণ করা হয়েছে এবং
              এর নির্মাণ কাজ চলমান রয়েছে।
            </p>

            {/* Future features */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3 bg-[#f0faf4] rounded-xl px-4 py-3">
                  <CheckCircle2 size={18} className="text-[#1a7a4a] shrink-0" />
                  <span className="text-gray-700 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── History ── */}
          <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
            <SectionTitle>মসজিদের ইতিহাস</SectionTitle>

            {/* Founder card */}
            <div className="mt-6 flex flex-col sm:flex-row gap-6 items-start bg-linear-to-br from-[#f0faf4] to-[#fdf8ee] rounded-2xl p-6 border border-[#1a7a4a]/10">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#d4a017] shadow-md shrink-0 mx-auto sm:mx-0">
                <Image src="/founder.jpeg" alt="Founder" width={80} height={80} className="object-cover w-full h-full" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#d4a017] uppercase tracking-widest mb-1">প্রতিষ্ঠাতা ও দাতা</p>
                <h3 className="text-lg font-bold text-[#0f2d1a]">মরহুম আব্দুল মুন্নাফ মাদবর</h3>
                <p className="text-sm text-gray-500">পিতা: মরহুম দিলবর মাদবর</p>
                <p className="text-sm text-gray-600 mt-2 leading-6">
                  আল্লাহর সন্তুষ্টির জন্য নয়াবাড়ি মৌজায় সর্বমোট ০৬ শতাংশ এবং বিলবাঘিল মৌজায় আরো ০৬ শতাংশ জমি মসজিদের
                  নামে দান করেন।
                </p>
              </div>
            </div>

            <p className="text-gray-600 leading-8 text-[15px] mt-5">
              এক সময় নয়াবাড়ি এলাকায় মুসলিম জনসংখ্যা তুলনামূলক কম ছিল। তখন এলাকার মুসল্লিগণ ঢাকা–আরিচা মহাসড়কের অপর
              পাশে অবস্থিত নয়াবাড়ি কেন্দ্রীয় জামে মসজিদে সালাত আদায় করতেন। কিন্তু সময়ের সাথে সাথে জনসংখ্যা বৃদ্ধি পায়
              এবং ব্যস্ত মহাসড়ক পার হয়ে নামাজ আদায় করা এলাকাবাসীর জন্য কষ্টসাধ্য হয়ে ওঠে।
            </p>
            <p className="text-gray-600 leading-8 text-[15px] mt-3">
              তার এই মহান উদ্যোগ এবং এলাকার মুসল্লিদের সহযোগিতায় <strong className="text-[#1a7a4a]">১৪২০ হিজরি / ২০০০ খ্রিস্টাব্দে</strong> অতি
              ছোট পরিসরে মসজিদটির নির্মাণ কাজ শুরু হয়। পরবর্তীতে মুসল্লিদের দান, সহযোগিতা ও আন্তরিক প্রচেষ্টায় মসজিদটি
              ধীরে ধীরে সম্প্রসারিত হয়ে একটি গুরুত্বপূর্ণ জামে মসজিদে পরিণত হয়।
            </p>
          </section>

          {/* ── Mission & Objectives ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-3xl shadow-sm p-8">
              <SectionTitle>মসজিদের লক্ষ্য</SectionTitle>
              <p className="text-gray-600 leading-8 text-[15px] mt-4">
                নয়াবাড়ি পাঁচ তারা জামে মসজিদ কমপ্লেক্সকে একটি আদর্শ ইসলামী কেন্দ্র হিসেবে গড়ে তোলা, যেখানে ইবাদত,
                শিক্ষা, দাওয়াহ এবং সামাজিক কল্যাণমূলক কার্যক্রম একত্রে পরিচালিত হবে এবং সমাজে ইসলামী মূল্যবোধ প্রতিষ্ঠা পাবে।
              </p>
            </section>

            <section className="bg-white rounded-3xl shadow-sm p-8">
              <SectionTitle>মসজিদের উদ্দেশ্য</SectionTitle>
              <ul className="mt-4 space-y-2">
                {objectives.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-gray-600 text-sm leading-6">
                    <CheckCircle2 size={16} className="text-[#1a7a4a] mt-0.5 shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── Construction Project ── */}
          <section className="bg-linear-to-br from-[#0f2d1a] to-[#1a1a2e] rounded-3xl p-8 md:p-10 text-white">
            <h2 className="text-2xl font-bold text-[#d4a017] mb-2">নির্মাণ প্রকল্প</h2>
            <div className="w-12 h-1 bg-[#d4a017] rounded mb-5" />
            <p className="text-white/80 leading-8 text-[15px] mb-6">
              বর্তমানে নয়াবাড়ি পাঁচ তারা জামে মসজিদকে একটি আধুনিক <strong className="text-white">৫ তলা বিশিষ্ট কমপ্লেক্সে</strong> রূপান্তরের
              কাজ চলমান রয়েছে। এই কমপ্লেক্স নির্মিত হলে এটি হবে এলাকার একটি পূর্ণাঙ্গ ইসলামী কেন্দ্র।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {facilities.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                  <span className="text-[#d4a017]">{f.icon}</span>
                  <span className="text-white/90 text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Donation ── */}
          <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
            <SectionTitle>দান আহ্বান</SectionTitle>
            <div className="mt-5 bg-[#fdf8ee] border border-[#d4a017]/30 rounded-2xl p-6">
              <p className="text-sm text-gray-500 mb-1">রাসূলুল্লাহ ﷺ বলেছেন:</p>
              <blockquote className="text-[#0f2d1a] font-semibold text-base leading-7 italic border-l-4 border-[#d4a017] pl-4">
                &ldquo;যে ব্যক্তি আল্লাহর সন্তুষ্টির জন্য একটি মসজিদ নির্মাণ করে, আল্লাহ তার জন্য জান্নাতে একটি ঘর নির্মাণ করেন।&rdquo;
              </blockquote>
              <p className="text-xs text-gray-500 mt-2">— সহিহ বুখারি ও মুসলিম</p>
            </div>

            <p className="text-gray-600 leading-8 text-[15px] mt-5">
              নয়াবাড়ি পাঁচ তারা জামে মসজিদ কমপ্লেক্স নির্মাণে আপনার যে কোন দান, সহযোগিতা একটি চলমান{" "}
              <strong className="text-[#1a7a4a]">সাদাকায়ে জারিয়া</strong> হিসেবে গণ্য হবে ইনশাহ আল্লাহ।
            </p>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {donationOptions.map((d) => (
                <div key={d} className="flex flex-col items-center justify-center text-center bg-[#f0faf4] rounded-2xl p-4 border border-[#1a7a4a]/10 gap-2">
                  <Heart size={20} className="text-[#1a7a4a]" />
                  <span className="text-gray-700 text-sm font-medium">{d}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Contact ── */}
          <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
            <SectionTitle>যোগাযোগ</SectionTitle>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ContactCard icon={<MapPin size={20} />} label="ঠিকানা">
                {contact?.address?.bn || "নয়াবাড়ি, সাভার, ঢাকা"}
              </ContactCard>
              <ContactCard icon={<Phone size={20} />} label="মোবাইল">
                {contact?.phones?.map((p) => (
                  <a key={p} href={`tel:${p.replace(/-/g, "")}`} className="hover:underline block">{p}</a>
                )) || (
                  <>
                    <a href="tel:01976172140" className="hover:underline block">০১৯৭৬-১৭২১৪০</a>
                    <a href="tel:01715498487" className="hover:underline block">০১৭১৫-৪৯৮৪৮৭</a>
                    <a href="tel:01715702740" className="hover:underline block">০১৭১৫-৭০২৭৪০</a>
                  </>
                )}
              </ContactCard>
              <ContactCard icon={<Mail size={20} />} label="ইমেইল">
                <a href={`mailto:${contact?.email || "panchtaramasjid@gmail.com"}`} className="hover:underline break-all text-xs">
                  {contact?.email || "panchtaramasjid@gmail.com"}
                </a>
              </ContactCard>
              <ContactCard icon={<Globe size={20} />} label="ওয়েবসাইট">
                <a href="https://panchtaramasjid.com" target="_blank" rel="noreferrer" className="hover:underline">
                  panchtaramasjid.com
                </a>
              </ContactCard>
            </div>
          </section>

          {/* ── Dua ── */}
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm leading-8 max-w-2xl mx-auto">
              আল্লাহ তাআলা যেন নয়াবাড়ি পাঁচ তারা জামে মসজিদ কমপ্লেক্সের নির্মাণ কাজ দ্রুত ও সুন্দরভাবে সম্পন্ন করার
              তাওফিক দান করেন এবং প্রতিষ্ঠাতা, দাতা ও সকল সহযোগীদের উত্তম প্রতিদান দান করেন।{" "}
              <strong className="text-[#1a7a4a]">আমীন।</strong>
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-[#0f2d1a]">{children}</h2>
      <div className="w-10 h-1 bg-[#d4a017] rounded mt-2" />
    </div>
  );
}

function ContactCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 bg-[#f8f6f0] rounded-2xl p-5">
      <div className="w-10 h-10 rounded-full bg-[#1a7a4a]/10 flex items-center justify-center text-[#1a7a4a]">
        {icon}
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <div className="text-gray-700 text-sm leading-6">{children}</div>
    </div>
  );
}
