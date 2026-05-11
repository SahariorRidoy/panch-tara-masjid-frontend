"use client";
import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const QURAN_PDF = "/quran-bangla.pdf";

export default function QuranSection() {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const { lang } = useLang();

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  return (
    <section id="quran" className="relative py-12 bg-white overflow-hidden">
      <div className="absolute inset-0 pattern-geometric" />
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center gap-6">

        {/* Header */}
        <div className="text-center">
          <p className="text-md font-semibold uppercase tracking-widest text-[#d4a017] mb-1">
            {lang === "bn" ? "পবিত্র কুরআন" : "The Holy Quran"}
          </p>
          <p className="text-gray-500 text-sm">
            {lang === "bn" ? "বাংলা অনুবাদসহ পবিত্র কুরআন পড়ুন" : "Read the Holy Quran with Bengali Translation"}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
          {/* RTL: left = next */}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, numPages))}
            disabled={page >= numPages}
            className="w-9 h-9  cursor-pointer flex items-center justify-center rounded-full bg-[#1a7a4a] hover:bg-[#155f39] disabled:opacity-30 text-white shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm text-gray-600 font-mono min-w-17.5 text-center">
            {page} / {numPages || "—"}
          </span>

          {/* RTL: right = prev */}
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            className="w-9 h-9 cursor-pointer flex items-center justify-center rounded-full bg-[#1a7a4a] hover:bg-[#155f39] disabled:opacity-30 text-white shadow-sm"
          >
            <ChevronRight size={20} />
          </button>

          <div className="w-px h-5 bg-gray-200" />

          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-100 text-[#1a7a4a]"
          >
            <ZoomIn size={18} />
          </button>

          <span className="text-xs text-gray-500 min-w-9 text-center">{Math.round(zoom * 100)}%</span>

          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
            className="w-8 cursor-pointer h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#1a7a4a]"
          >
            <ZoomOut size={18} />
          </button>

          <div className="w-px h-5 bg-gray-200" />

          <a
            href={QURAN_PDF}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#d4a017]"
          >
            <Maximize2 size={18} />
          </a>
        </div>

        {/* PDF Page */}
        <div
          className="overflow-auto rounded-lg shadow-lg border border-gray-200 bg-white"
          style={{ maxWidth: "100%", maxHeight: "80vh" }}
        >
          <Document file={QURAN_PDF} onLoadSuccess={onLoadSuccess}>
            <Page
              pageNumber={page}
              scale={zoom}
              renderTextLayer
              renderAnnotationLayer={false}
            />
          </Document>
        </div>

      </div>
    </section>
  );
}
