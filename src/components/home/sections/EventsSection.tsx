"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import api from "@/lib/axios";
import { Event, CommitteeMember, Document } from "@/types";
import { CalendarDays, Phone, Users, ChevronLeft, ChevronRight, Download, FileText, Eye, X, Loader2, PackageOpen, ExternalLink } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { scaleIn } from "@/lib/animations";

const IMAGE_TYPES  = ["jpg", "jpeg", "png", "webp", "gif"];
const PDF_TYPES    = ["pdf"];
const OFFICE_TYPES = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
const TEXT_TYPES   = ["txt"];

type PreviewKind = "image" | "pdf" | "office" | "text" | "none";
const getPreviewKind = (type: string): PreviewKind => {
  const t = type.toLowerCase();
  if (IMAGE_TYPES.includes(t))  return "image";
  if (PDF_TYPES.includes(t))    return "pdf";
  if (OFFICE_TYPES.includes(t)) return "office";
  if (TEXT_TYPES.includes(t))   return "text";
  return "none";
};
import { useLang } from "@/lib/LangContext";

const statusColor: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700",
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};

const demoEvents: Event[] = [
  {
    _id: "d1", status: "upcoming",
    title:       { en: "Annual Quran Recitation Competition", bn: "বার্ষিক কুরআন তেলাওয়াত প্রতিযোগিতা" },
    description: { en: "Join us for our annual Quran recitation competition open to all age groups.", bn: "সকল বয়সের জন্য উন্মুক্ত বার্ষিক কুরআন তেলাওয়াত প্রতিযোগিতায় যোগ দিন।" },
    date: new Date(Date.now() + 7 * 86400000).toISOString(),
  },
  {
    _id: "d2", status: "upcoming",
    title:       { en: "Eid-ul-Adha Congregation Prayer", bn: "ঈদুল আযহার জামাত নামাজ" },
    description: { en: "Eid prayer will be held at the masjid ground. All are welcome to join.", bn: "মসজিদ মাঠে ঈদের নামাজ অনুষ্ঠিত হবে। সকলকে স্বাগত জানানো হচ্ছে।" },
    date: new Date(Date.now() + 14 * 86400000).toISOString(),
  },
  {
    _id: "d3", status: "upcoming",
    title:       { en: "Islamic Education Seminar", bn: "ইসলামিক শিক্ষা সেমিনার" },
    description: { en: "A seminar on Islamic education and its importance in modern life.", bn: "আধুনিক জীবনে ইসলামিক শিক্ষার গুরুত্ব বিষয়ক সেমিনার।" },
    date: new Date(Date.now() + 21 * 86400000).toISOString(),
  },
];

// 3D tilt card
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 300, damping: 30 });
  const shadow = useTransform(rotateY, [-7, 0, 7], [
    "0 20px 40px rgba(26,122,74,0.25)",
    "0 8px 20px rgba(0,0,0,0.08)",
    "0 20px 40px rgba(212,160,23,0.2)",
  ]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, boxShadow: shadow, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function EventImageCarousel({ images, title, status }: { images: string[]; title: string; status: string }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const offset = useState(() => Math.floor(Math.random() * 2000))[0];

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3000 + offset);
    return () => clearInterval(t);
  }, [images.length, paused, tick, offset]);

  const prev = (e: React.MouseEvent) => { e.preventDefault(); setIdx((i) => (i - 1 + images.length) % images.length); setTick(t => t + 1); };
  const next = (e: React.MouseEvent) => { e.preventDefault(); setIdx((i) => (i + 1) % images.length); setTick(t => t + 1); };

  return (
    <div className="relative h-44 bg-[#f5f0e8] group" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {images.length > 0 ? (
        images.map((src, i) => (
          <Image key={src} src={src} alt={title} fill
            className="object-cover transition-opacity duration-500"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <CalendarDays size={36} className="text-[#1a7a4a]/30" />
        </div>
      )}
      <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full z-10 ${statusColor[status]}`}>{status}</span>
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button key={i} onClick={(e) => { e.preventDefault(); setIdx(i); }}
                className={`rounded-full transition-all ${i === idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

async function downloadFile(fileUrl: string, filename: string) {
  const res = await fetch(fileUrl);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function EventsSection() {
  const { lang } = useLang();
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [txtContent, setTxtContent] = useState<string | null>(null);
  const [txtLoading, setTxtLoading] = useState(false);

  const openPreview = async (d: Document) => {
    setPreviewDoc(d);
    setTxtContent(null);
    if (getPreviewKind(d.fileType) === "text") {
      setTxtLoading(true);
      try {
        const res = await fetch(d.fileUrl);
        setTxtContent(await res.text());
      } catch {
        setTxtContent("Failed to load file content.");
      } finally {
        setTxtLoading(false);
      }
    }
  };

  const { data: apiEvents = [] } = useQuery<Event[]>({
    queryKey: ["events-home"],
    queryFn: () => api.get("/events?limit=3").then((r) => r.data.data?.data ?? r.data.data),
  });

  const events = apiEvents.length >= 3 ? apiEvents.slice(0, 3) : [...apiEvents, ...demoEvents].slice(0, 3);

  const { data: notices = [] } = useQuery<{ _id?: string; title: { en: string; bn: string } }[]>({
    queryKey: ["notices-home"],
    queryFn: () => api.get("/notices?pinned=true&limit=5").then((r) => r.data.data?.data ?? r.data.data),
  });
  const noticeList = notices;

  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["documents-home"],
    queryFn: () => api.get("/documents?isPublic=true&limit=5").then((r) => r.data.data?.data ?? r.data.data),
  });

  const { data: committee = [] } = useQuery<CommitteeMember[]>({
    queryKey: ["committee-home"],
    queryFn: () => api.get("/committee?limit=5").then((r) => {
      const data: CommitteeMember[] = r.data.data?.data ?? r.data.data;
      return [...data].reverse();
    }),
  });

  return (
    <section className="relative py-10 bg-[#ffffff] overflow-hidden">
      <div className="absolute inset-0 pattern-geometric" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT — Events + Notices */}
          <div className="lg:col-span-3 flex flex-col gap-8" id="events">
            <motion.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-[#1a7a4a] border-l-4 border-[#d4a017] pl-3">
                {lang === "bn" ? "ইভেন্ট" : "Events"}
              </h2>
              <Link href="/events" className="text-sm text-[#1a7a4a] font-medium hover:underline">
                {lang === "bn" ? "সব দেখুন →" : "View All →"}
              </Link>
            </motion.div>

            {/* 3D Tilt Event Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ perspective: 1000 }}>
              {events.slice(0, 3).map((ev, idx) => {
                const imgs = (ev.images && ev.images.length > 0) ? ev.images : ev.imageUrl ? [ev.imageUrl] : [];
                return (
                  <motion.div
                    key={ev._id}
                    variants={scaleIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    custom={idx}
                  >
                    <TiltCard className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-full cursor-default">
                      <EventImageCarousel images={imgs} title={ev.title.en} status={ev.status} />
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-xs text-gray-400 mb-1">
                          {new Date(ev.date).toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <p className="font-semibold text-md text-gray-800 leading-snug mb-1 line-clamp-2">
                          {lang === "bn" ? ev.title.bn : ev.title.en}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-12 mb-3">
                          {lang === "bn" ? ev.description.bn : ev.description.en}
                        </p>
                        <Link href={`/events/${ev._id}`} className="mt-auto text-xs font-semibold text-[#1a7a4a] hover:underline">
                          {lang === "bn" ? "বিস্তারিত দেখুন →" : "View Details →"}
                        </Link>
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
              {events.length === 0 && <p className="text-gray-500 text-sm col-span-3">No upcoming events.</p>}
            </div>

            <div className="flex justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/events" className="text-sm font-semibold text-white bg-[#1a7a4a] px-6 py-2 rounded-lg hover:bg-[#155f3a] transition-colors">
                  {lang === "bn" ? "সব ইভেন্ট দেখুন" : "View All Events"}
                </Link>
              </motion.div>
            </div>

            {/* Notices & Documents — two columns */}
            <div id="notices" className=" mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Notices column */}
              <div>
                <motion.div
                  className="flex items-center justify-between mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-bold text-[#1a7a4a] border-l-4 border-[#d4a017] pl-3">
                    {lang === "bn" ? "নোটিশ" : "Notices"}
                  </h2>
                </motion.div>
                <div className="bg-white rounded-xl border-2 border-[#1a7a4a]/20 shadow-sm divide-y divide-gray-100 overflow-hidden">
                  {noticeList.length === 0 ? (
                    <p className="text-sm text-gray-400 px-4 py-6 text-center">
                      {lang === "bn" ? "কোনো নোটিশ নেই" : "No notices available"}
                    </p>
                  ) : noticeList.map((n, i) => (
                    <motion.div
                      key={n._id ?? i}
                      initial={{ opacity: 0, x: -24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      whileHover={{ backgroundColor: "#f0faf5", x: 4 }}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4a017] shrink-0" />
                      <p className="text-sm text-gray-700 leading-snug">{lang === "bn" ? n.title.bn : n.title.en}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Documents column */}
              <div>
                <motion.div
                  className="flex items-center justify-between mb-4"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-bold text-[#1a7a4a] border-l-4 border-[#d4a017] pl-3">
                    {lang === "bn" ? "ডকুমেন্ট" : "Documents"}
                  </h2>
                </motion.div>
                <div className="bg-white rounded-xl border-2 border-[#d4a017]/20 shadow-sm divide-y divide-gray-100 overflow-hidden">
                  {documents.length > 0 ? documents.map((d, i) => {
                    const ext = "." + (d.fileType ?? "pdf");
                    const filename = d.title.en.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ext;
                    return (
                    <motion.div
                      key={d._id}
                      initial={{ opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      whileHover={{ backgroundColor: "#f0faf5" }}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText size={14} className="shrink-0 text-[#1a7a4a]" />
                        <p className="text-sm text-gray-700 leading-snug truncate">{lang === "bn" ? d.title.bn : d.title.en}</p>
                      </div>
                      <div className="flex gap-1.5">
                        {getPreviewKind(d.fileType) !== "none" && (
                          <button
                            onClick={() => openPreview(d)}
                            className="shrink-0 flex items-center gap-1 text-xs font-medium text-white bg-[#1a7a4a] px-2.5 py-1 rounded-lg hover:bg-[#155f3a] transition-colors"
                          >
                            <Eye size={11} />
                            {lang === "bn" ? "দেখুন" : "View"}
                          </button>
                        )}
                        <button
                          onClick={() => downloadFile(d.fileUrl, filename)}
                          className="shrink-0 flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Download size={11} />
                        </button>
                      </div>
                    </motion.div>
                    );
                  }) : (
                    <p className="text-sm text-gray-400 px-4 py-6 text-center">
                      {lang === "bn" ? "কোনো ডকুমেন্ট নেই" : "No documents available"}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT — Committee */}
          <div id="committee">
            <motion.div
              className="rounded-xl p-4 flex flex-col items-center text-center gap-2 mb-4"
              initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="relative w-48 h-48 rounded-3xl overflow-hidden border-4 border-[#d4a017]">
                <Image src="/founder.jpeg" alt="Founder" fill className="object-cover" />
              </div>
              <p className="font-bold text-gray-800 text-sm">
                {lang === "bn" ? "মরহুম আব্দুল মুন্নাফ মাদবর" : "Late Abdul Munnaf Madbar"}
              </p>
              <span className="text-xs font-medium text-[#d4a017] bg-[#d4a017]/20 border border-[#d4a017]/40 px-2 py-0.5 rounded-full">
                {lang === "bn" ? "প্রতিষ্ঠাতা, জমিদাতা" : "Founder, Land Donor"}
              </span>
            </motion.div>

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-[#1a7a4a] border-l-4 border-[#d4a017] pl-3">
                {lang === "bn" ? "মসজিদ কমিটি" : "Mosque Committee"}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {committee.slice(0, 5).map((m, i) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(26,122,74,0.15)" }}
                  className="rounded-xl p-4 flex flex-col items-center text-center gap-2 bg-white border border-gray-100"
                >
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                    {m.imageUrl ? (
                      <Image src={m.imageUrl} alt={m.name.en} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#e8f5ee] flex items-center justify-center">
                        <Users size={28} className="text-[#1a7a4a]/60" />
                      </div>
                    )}
                  </div>
                  <p className="font-bold text-gray-800 text-sm">{lang === "bn" ? m.name.bn : m.name.en}</p>
                  <span className="text-xs font-medium text-[#d4a017] bg-[#d4a017]/20 border border-[#d4a017]/40 px-2 py-0.5 rounded-full">
                    {lang === "bn" ? m.designation.bn : m.designation.en}
                  </span>
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#1a7a4a]">
                      <Phone size={11} />{m.phone}
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (() => {
        const kind = getPreviewKind(previewDoc.fileType);
        return (
          <Dialog open={!!previewDoc} onOpenChange={() => { setPreviewDoc(null); setTxtContent(null); }}>
            <DialogContent className="w-[95vw] md:max-w-[60vw]! h-[80vh] flex flex-col !p-4 gap-0">
              <div className="flex items-center gap-3 pb-3 border-b shrink-0 pr-8">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{previewDoc.title.en}</p>
                  <p className="text-xs text-gray-400">{previewDoc.fileType.toUpperCase()} · {previewDoc.category}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={previewDoc.fileUrl} target="_blank" rel="noreferrer">
                    <button className="flex items-center gap-1.5 text-xs border rounded-lg px-3 py-1.5 hover:bg-gray-50">
                      <ExternalLink size={13} /> Open
                    </button>
                  </a>
                  <a href={previewDoc.fileUrl} download target="_blank" rel="noreferrer">
                    <button className="flex items-center gap-1.5 text-xs border rounded-lg px-3 py-1.5 hover:bg-gray-50">
                      <Download size={13} /> Download
                    </button>
                  </a>
                </div>
              </div>
              <div className="flex-1 overflow-hidden rounded-xl min-h-0 mt-3">
                {kind === "image" && (
                  <div className="relative w-full h-full">
                    <Image src={previewDoc.fileUrl} alt={previewDoc.title.en} fill className="object-contain" />
                  </div>
                )}
                {(kind === "pdf" || kind === "office") && (
                  <div className="relative w-full h-full">
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewDoc.fileUrl)}&embedded=true`}
                      className="w-full h-full rounded-xl border-0"
                      title={previewDoc.title.en}
                    />
                    <p className="absolute bottom-2 right-3 text-[10px] text-gray-400">Powered by Google Docs Viewer</p>
                  </div>
                )}
                {kind === "text" && (
                  <div className="w-full h-full overflow-y-auto bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-700 whitespace-pre-wrap">
                    {txtLoading ? (
                      <div className="flex items-center justify-center h-full gap-2 text-gray-400">
                        <Loader2 size={18} className="animate-spin" /> Loading...
                      </div>
                    ) : txtContent}
                  </div>
                )}
                {kind === "none" && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                    <PackageOpen size={40} />
                    <p className="text-sm">No preview available for .{previewDoc.fileType} files</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </section>
  );
}
