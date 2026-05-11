"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import type { Document, PaginatedData } from "@/types";
import { PageHeader, BilingualInput } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Pencil, Upload, Download, FileText, RefreshCw, FileImage, FileSpreadsheet, FileType, File, ChevronLeft, ChevronRight, Eye, Loader2, PackageOpen, ExternalLink, Globe, Lock } from "lucide-react";

type DocForm = { title: { en: string; bn: string }; description?: { en: string; bn: string }; category: string; isPublic: boolean };

const IMAGE_TYPES  = ["jpg", "jpeg", "png", "webp", "gif"];
const OFFICE_TYPES = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
const PDF_TYPES    = ["pdf"];
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

const FILE_ICON_MAP: Record<string, { icon: React.ElementType; bg: string; color: string; label: string }> = {
  pdf:  { icon: FileText,        bg: "bg-red-50",     color: "text-red-500",    label: "PDF"  },
  doc:  { icon: FileText,        bg: "bg-blue-50",    color: "text-blue-600",   label: "DOC"  },
  docx: { icon: FileText,        bg: "bg-blue-50",    color: "text-blue-600",   label: "DOCX" },
  xls:  { icon: FileSpreadsheet, bg: "bg-green-50",   color: "text-green-600",  label: "XLS"  },
  xlsx: { icon: FileSpreadsheet, bg: "bg-green-50",   color: "text-green-600",  label: "XLSX" },
  ppt:  { icon: FileType,        bg: "bg-orange-50",  color: "text-orange-500", label: "PPT"  },
  pptx: { icon: FileType,        bg: "bg-orange-50",  color: "text-orange-500", label: "PPTX" },
  txt:  { icon: FileText,        bg: "bg-gray-50",    color: "text-gray-500",   label: "TXT"  },
  zip:  { icon: File,            bg: "bg-purple-50",  color: "text-purple-500", label: "ZIP"  },
  jpg:  { icon: FileImage,       bg: "bg-pink-50",    color: "text-pink-500",   label: "JPG"  },
  jpeg: { icon: FileImage,       bg: "bg-pink-50",    color: "text-pink-500",   label: "JPEG" },
  png:  { icon: FileImage,       bg: "bg-pink-50",    color: "text-pink-500",   label: "PNG"  },
  webp: { icon: FileImage,       bg: "bg-pink-50",    color: "text-pink-500",   label: "WEBP" },
  gif:  { icon: FileImage,       bg: "bg-pink-50",    color: "text-pink-500",   label: "GIF"  },
};

const getFileMeta = (type: string) =>
  FILE_ICON_MAP[type.toLowerCase()] ?? { icon: File, bg: "bg-gray-50", color: "text-gray-500", label: type.toUpperCase() };

const ACCEPT_ALL = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.jpg,.jpeg,.png,.webp,.gif";

const FILE_TYPE_FILTERS = [
  { value: "all",  label: "All Types" },
  { value: "pdf",  label: "PDF" },
  { value: "doc",  label: "Word (DOC/DOCX)" },
  { value: "xls",  label: "Excel (XLS/XLSX)" },
  { value: "ppt",  label: "PowerPoint" },
  { value: "jpg",  label: "Image" },
  { value: "txt",  label: "Text" },
  { value: "zip",  label: "ZIP" },
];

export default function DocumentsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editItem, setEditItem] = useState<Document | null>(null);
  const [previewDoc, setPreviewDoc]   = useState<Document | null>(null);
  const [txtContent, setTxtContent]   = useState<string | null>(null);
  const [txtLoading, setTxtLoading]   = useState(false);

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
  const [file, setFile] = useState<globalThis.File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filterParam = typeFilter !== "all" ? `&fileType=${typeFilter}` : "";

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedData<Document>>({
    queryKey: ["documents-admin", page, typeFilter],
    queryFn: () => api.get(`/documents?page=${page}&limit=12${filterParam}`).then((r) => r.data.data),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  const { register: regUpload, handleSubmit: handleUpload, reset: resetUpload, watch: watchUpload, setValue: setUploadValue } = useForm<DocForm>({
    defaultValues: { isPublic: false },
  });
  const { register: regEdit, handleSubmit: handleEdit, reset: resetEdit } = useForm<DocForm>();

  const upload = useMutation({
    mutationFn: (d: DocForm) => {
      if (!file) throw new Error("No file");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", JSON.stringify(d.title));
      if (d.description) fd.append("description", JSON.stringify(d.description));
      fd.append("category", d.category);
      fd.append("isPublic", String(d.isPublic));
      return api.post("/documents", fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents-admin"] });
      setUploadOpen(false);
      setFile(null);
      resetUpload();
      swal.success("Uploaded!");
    },
    onError: () => swal.error("Upload Failed"),
  });

  const togglePublic = useMutation({
    mutationFn: (d: Document) => api.patch(`/documents/${d._id}`, { isPublic: !d.isPublic }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents-admin"] });
      swal.success("Visibility updated!");
    },
    onError: () => swal.error("Failed to update visibility"),
  });

  const handleTogglePublic = async (d: Document) => {
    const result = await swal.confirm(
      d.isPublic ? "Make Private?" : "Make Public?",
      d.isPublic
        ? "This document will be hidden from the public website."
        : "This document will be visible on the public website."
    );
    if (result.isConfirmed) togglePublic.mutate(d);
  };

  const update = useMutation({
    mutationFn: (d: DocForm) =>
      api.patch(`/documents/${editItem?._id}`, { title: d.title, category: d.category }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents-admin"] });
      setEditItem(null);
      swal.success("Updated!");
    },
    onError: () => swal.error("Update Failed"),
  });

  const handleDelete = async (d: Document) => {
    const result = await swal.confirmDelete(d.title.en);
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/documents/${d._id}`);
      qc.invalidateQueries({ queryKey: ["documents-admin"] });
      swal.success("Deleted!");
    } catch {
      swal.error("Delete Failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Documents"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button onClick={() => setUploadOpen(true)} className="bg-[#1a7a4a] hover:bg-[#155f3a]">
              <Plus size={16} className="mr-1" /> Upload
            </Button>
          </div>
        }
      />

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILE_TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setTypeFilter(f.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              typeFilter === f.value
                ? "bg-[#1a7a4a] text-white border-[#1a7a4a]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#1a7a4a] hover:text-[#1a7a4a]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <>
          {data?.data.length === 0 && (
            <p className="text-center text-gray-400 py-12 bg-white rounded-xl border">No documents found</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data?.data.map((d) => {
              const meta = getFileMeta(d.fileType);
              const Icon = meta.icon;
              return (
                <div key={d._id} className="bg-white rounded-xl border shadow-sm p-3 flex items-start gap-3 hover:shadow-md transition-shadow">
                  {/* Thumbnail or icon */}
                  <div className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center ${meta.bg}`}>
                    {getPreviewKind(d.fileType) === "image" ? (
                      <Image src={d.fileUrl} alt={d.title.en} width={48} height={48} className="object-cover w-full h-full" />
                    ) : (
                      <Icon size={22} className={meta.color} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${meta.bg} ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 text-sm truncate">{d.title.en}</p>
                    <p className="text-xs text-gray-400 truncate">{d.category} · {new Date(d.createdAt).toLocaleDateString("en-BD", { dateStyle: "medium" })}</p>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    {/* Visibility Switch */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublic(d)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors w-full"
                    >
                      {/* Track */}
                      <div className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
                        d.isPublic ? "bg-emerald-500" : "bg-gray-300"
                      }`}>
                        {/* Thumb */}
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                          d.isPublic ? "left-[18px]" : "left-0.5"
                        }`} />
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        {d.isPublic
                          ? <Globe size={11} className="text-emerald-600 shrink-0" />
                          : <Lock size={11} className="text-gray-400 shrink-0" />}
                        <span className={`text-xs font-semibold ${
                          d.isPublic ? "text-emerald-600" : "text-gray-400"
                        }`}>
                          {d.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                    </button>
                    {getPreviewKind(d.fileType) !== "none" ? (
                      <Button size="sm" variant="outline" onClick={() => openPreview(d)} className="gap-1.5 text-xs">
                        <Eye size={13} /> View
                      </Button>
                    ) : (
                      <a href={d.fileUrl} target="_blank" rel="noreferrer" download>
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs w-full">
                          <Download size={13} /> Download
                        </Button>
                      </a>
                    )}
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs"
                      onClick={() => { setEditItem(d); resetEdit({ title: d.title, category: d.category }); }}>
                      <Pencil size={13} /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDelete(d)}>
                      <Trash2 size={13} /> Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft size={14} /> Prev
                </Button>
                <Button size="sm" variant="outline" disabled={page >= data.pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={(open) => { if (!open) { setFile(null); resetUpload(); } setUploadOpen(open); }}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Upload Document / File</DialogTitle></DialogHeader>
          <form onSubmit={handleUpload((d) => upload.mutate(d))} className="space-y-4">
            <div>
              <Label>File (PDF, Word, Excel, PPT, Image, TXT, ZIP — max 30MB) *</Label>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={`w-full flex flex-col items-center gap-2 border-2 border-dashed rounded-xl px-4 py-6 text-sm transition-colors ${
                    file ? "border-[#1a7a4a] bg-emerald-50 text-[#1a7a4a]" : "border-gray-300 text-gray-400 hover:border-[#1a7a4a]"
                  }`}
                >
                  <Upload size={22} />
                  {file ? (
                    <span className="font-medium">{file.name} <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(0)} KB)</span></span>
                  ) : (
                    <span>Click to choose any file type</span>
                  )}
                </button>
                <input ref={fileRef} type="file" accept={ACCEPT_ALL} className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
            <BilingualInput label="Title *" nameEn="title.en" nameBn="title.bn" register={regUpload} />
            <BilingualInput label="Description" nameEn="description.en" nameBn="description.bn" register={regUpload} textarea />
            <div>
              <Label>Category *</Label>
              <Input {...regUpload("category")} placeholder="report, notice, certificate, photo..." className="mt-1" required />
            </div>
            <div
              onClick={() => setUploadValue("isPublic", !watchUpload("isPublic"))}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors select-none"
            >
              <div className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                watchUpload("isPublic") ? "bg-emerald-500" : "bg-gray-300"
              }`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  watchUpload("isPublic") ? "left-5" : "left-1"
                }`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  {watchUpload("isPublic")
                    ? <><Globe size={14} className="text-emerald-600" /> <span className="text-emerald-600">Public</span></>
                    : <><Lock size={14} className="text-gray-400" /> <span className="text-gray-500">Private</span></>}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {watchUpload("isPublic")
                    ? "Visible on the public website"
                    : "Only visible to admins"}
                </p>
              </div>
              <input type="checkbox" {...regUpload("isPublic")} className="hidden" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#1a7a4a] hover:bg-[#155f3a]" disabled={upload.isPending || !file}>
                {upload.isPending ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Document</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit((d) => update.mutate(d))} className="space-y-4">
            <BilingualInput label="Title" nameEn="title.en" nameBn="title.bn" register={regEdit} />
            <div><Label>Category</Label><Input {...regEdit("category")} className="mt-1" /></div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
              <Button type="submit" className="bg-[#1a7a4a] hover:bg-[#155f3a]" disabled={update.isPending}>
                {update.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Universal Preview Dialog */}
      {previewDoc && (() => {
        const kind = getPreviewKind(previewDoc.fileType);
        const meta = getFileMeta(previewDoc.fileType);
        return (
          <Dialog open={!!previewDoc} onOpenChange={() => { setPreviewDoc(null); setTxtContent(null); }}>
            <DialogContent className="w-[95vw] md:!max-w-[40vw] h-[50vh] !grid-cols-none flex flex-col !p-4 gap-0">
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 border-b shrink-0">
                <div className={`p-2 rounded-lg ${meta.bg}`}>
                  <meta.icon size={18} className={meta.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{previewDoc.title.en}</p>
                  <p className="text-xs text-gray-400">{meta.label} · {previewDoc.category}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={previewDoc.fileUrl} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ExternalLink size={13} /> Open
                    </Button>
                  </a>
                  <a href={previewDoc.fileUrl} download target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Download size={13} /> Download
                    </Button>
                  </a>
                </div>
              </div>

              {/* Preview Body */}
              <div className="flex-1 overflow-hidden rounded-xl min-h-0 mt-3">

                {/* Image */}
                {kind === "image" && (
                  <div className="relative w-full h-full">
                    <Image src={previewDoc.fileUrl} alt={previewDoc.title.en} fill className="object-contain" />
                  </div>
                )}

                {/* PDF — force inline via Google Docs Viewer same as office */}
                {kind === "pdf" && (
                  <div className="relative w-full h-full">
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewDoc.fileUrl)}&embedded=true`}
                      className="w-full h-full rounded-xl border-0"
                      title={previewDoc.title.en}
                    />
                    <p className="absolute bottom-2 right-3 text-[10px] text-gray-400">Powered by Google Docs Viewer</p>
                  </div>
                )}

                {/* Office — Google Docs Viewer */}
                {kind === "office" && (
                  <div className="relative w-full h-full">
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewDoc.fileUrl)}&embedded=true`}
                      className="w-full h-full rounded-xl border-0"
                      title={previewDoc.title.en}
                    />
                    <p className="absolute bottom-2 right-3 text-[10px] text-gray-400">Powered by Google Docs Viewer</p>
                  </div>
                )}

                {/* TXT */}
                {kind === "text" && (
                  <div className="w-full h-full overflow-y-auto bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-700 whitespace-pre-wrap">
                    {txtLoading ? (
                      <div className="flex items-center justify-center h-full gap-2 text-gray-400">
                        <Loader2 size={18} className="animate-spin" /> Loading...
                      </div>
                    ) : txtContent}
                  </div>
                )}

                {/* No preview */}
                {kind === "none" && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                    <PackageOpen size={40} />
                    <p className="text-sm">No preview available for .{previewDoc.fileType} files</p>
                    <a href={previewDoc.fileUrl} download target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download size={13} /> Download to view
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
}
