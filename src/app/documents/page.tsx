"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { Document } from "@/types";
import { useLang } from "@/lib/LangContext";
import { FileText, Download, Eye, Loader2, PackageOpen, ChevronLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navbar from "@/components/home/Navbar";
import { Footer } from "@/components/home/BottomSections";

const IMAGE_TYPES  = ["jpg", "jpeg", "png", "webp", "gif"];
const PDF_TYPES    = ["pdf"];
const OFFICE_TYPES = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
const TEXT_TYPES   = ["txt"];

const getPreviewKind = (type: string) => {
  const t = type.toLowerCase();
  if (IMAGE_TYPES.includes(t)) return "image";
  if (PDF_TYPES.includes(t)) return "pdf";
  if (OFFICE_TYPES.includes(t)) return "office";
  if (TEXT_TYPES.includes(t)) return "text";
  return "none";
};

export default function DocumentsPage() {
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

  const { data, isLoading } = useQuery<Document[]>({
    queryKey: ["documents"],
    queryFn: () => api.get("/documents?isPublic=true").then((r) => r.data.data?.data ?? r.data.data),
  });

  const documents = data ?? [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-b from-white to-[#f8fdf9]">
        <div className="max-w-6xl mx-auto px-4 py-12">

          {/* Header */}
          <motion.div className="mb-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-[#1a7a4a] rounded-full" />
              <h1 className="text-4xl font-bold text-gray-900">
                {lang === "bn" ? "ডকুমেন্টস" : "Documents"}
              </h1>
            </div>
            <p className="text-gray-500 ml-4">
              {lang === "bn" ? "আমাদের গুরুত্বপূর্ণ নথি ও ফাইলসমূহ" : "Our important documents and files"}
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["all", "pdf", "image", "office", "text"].map((cat) => (
              <span key={cat} className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#f8f6f0] text-gray-600 capitalize">
                {cat === "all" ? (lang === "bn" ? "সব" : "All") : cat}
              </span>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && documents.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-30" />
              <p>{lang === "bn" ? "কোনো ডকুমেন্ট পাওয়া যায়নি।" : "No documents found."}</p>
            </div>
          )}

          {/* Documents List */}
          {!isLoading && documents.length > 0 && (
            <div className="space-y-3">
              {documents.map((d, idx) => {
                const ext = "." + (d.fileType ?? "pdf");
                const filename = d.title.en.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ext;
                const kind = getPreviewKind(d.fileType);

                return (
                  <motion.div
                    key={d._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-[#f8f6f0] flex items-center justify-center shrink-0">
                        <FileText size={24} className="text-[#1a7a4a]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{lang === "bn" ? d.title.bn : d.title.en}</p>
                        <p className="text-xs text-gray-500 capitalize">{d.category} · {d.fileType.toUpperCase()} · {new Date(d.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {kind !== "none" && (
                        <button
                          onClick={() => openPreview(d)}
                          className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#1a7a4a] px-3 py-1.5 rounded-lg hover:bg-[#155f3a] transition-colors"
                        >
                          <Eye size={12} />
                          {lang === "bn" ? "দেখুন" : "View"}
                        </button>
                      )}
                      <a href={d.fileUrl} download target="_blank" rel="noreferrer">
                        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                          <Download size={12} />
                          {lang === "bn" ? "ডাউনলোড" : "Download"}
                        </button>
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Back to Events */}
          <div className="mt-12 text-center">
            <Link href="/events#notices" className="inline-flex items-center gap-2 text-[#1a7a4a] font-medium hover:underline">
              <ChevronLeft size={16} />
              {lang === "bn" ? "ইভেন্টস পেজে ফিরুন" : "Back to Events Page"}
            </Link>
          </div>
        </div>
      </main>
      <Footer />

      {/* Preview Modal */}
      {previewDoc && (() => {
        const kind = getPreviewKind(previewDoc.fileType);
        return (
          <Dialog open={!!previewDoc} onOpenChange={() => { setPreviewDoc(null); setTxtContent(null); }}>
            <DialogContent className="w-[95vw] md:max-w-[60vw] h-[80vh] flex flex-col p-4! gap-0">
              <div className="flex items-center gap-3 pb-3 border-b shrink-0 pr-8">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{previewDoc.title.en}</p>
                  <p className="text-xs text-gray-400">{previewDoc.fileType.toUpperCase()} · {previewDoc.category}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={previewDoc.fileUrl} target="_blank" rel="noreferrer">
                    <button className="flex items-center gap-1.5 text-xs border rounded-lg px-3 py-1.5 hover:bg-gray-50">
                      <Eye size={13} /> {lang === "bn" ? "নতুন ট্যাবে খুলুন" : "Open in New Tab"}
                    </button>
                  </a>
                  <a href={previewDoc.fileUrl} download target="_blank" rel="noreferrer">
                    <button className="flex items-center gap-1.5 text-xs border rounded-lg px-3 py-1.5 hover:bg-gray-50">
                      <Download size={13} /> {lang === "bn" ? "ডাউনলোড" : "Download"}
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
    </>
  );
}
