"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { MediaItem, PaginatedData } from "@/types";
import { PageHeader } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Pencil, Upload, RefreshCw } from "lucide-react";
import Image from "next/image";

type UploadForm = { title: string; category: string };

export default function MediaPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedData<MediaItem>>({
    queryKey: ["media-admin", page],
    queryFn: () => api.get(`/media?page=${page}&limit=12`).then((r) => r.data.data),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  const { register: regUpload, handleSubmit: handleUpload, reset: resetUpload } = useForm<UploadForm>();
  const { register: regEdit, handleSubmit: handleEdit, reset: resetEdit } = useForm<UploadForm>();

  const upload = useMutation({
    mutationFn: (d: UploadForm) => {
      if (!file) throw new Error("No file");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", d.title);
      fd.append("category", d.category || "general");
      return api.post("/media", fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["media-admin"] });
      setUploadOpen(false); setFile(null); resetUpload();
      swal.success("Uploaded!");
    },
    onError: () => swal.error("Upload Failed"),
  });

  const update = useMutation({
    mutationFn: (d: UploadForm) => api.put(`/media/${editItem?._id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["media-admin"] }); setEditItem(null); swal.success("Updated!"); },
    onError: () => swal.error("Update Failed"),
  });

  const handleDelete = async (m: MediaItem) => {
    const result = await swal.confirmDelete(m.title);
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/media/${m._id}`);
      qc.invalidateQueries({ queryKey: ["media-admin"] });
      swal.success("Deleted!");
    } catch {
      swal.error("Delete Failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Media Gallery"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button onClick={() => setUploadOpen(true)} className="bg-[#1a7a4a] hover:bg-[#155f3a]">
              <Plus size={16} className="mr-1" />Upload
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {data?.data.map((m) => (
            <div key={m._id} className="group relative bg-white rounded-xl border shadow-sm overflow-hidden">
              {m.url ? (
                <Image src={m.url} alt={m.title} width={300} height={200} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No image</div>
              )}
              <div className="p-2">
                <p className="text-xs font-medium text-gray-700 truncate">{m.title}</p>
                <p className="text-xs text-gray-400">{m.category}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditItem(m); resetEdit({ title: m.title, category: m.category }); }}
                  className="bg-white rounded-full p-1.5 shadow hover:bg-gray-50"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleDelete(m)}
                  className="bg-white rounded-full p-1.5 shadow text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {data?.data.length === 0 && <p className="text-gray-500 col-span-4">No media found.</p>}
        </div>
      )}

      {data?.pagination && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>Page {data.pagination.page} of {data.pagination.totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <Button size="sm" variant="outline" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Upload Image</DialogTitle></DialogHeader>
          <form onSubmit={handleUpload((d) => upload.mutate(d))} className="space-y-4">
            <div>
              <Label>Image File *</Label>
              <div className="mt-1 flex items-center gap-3">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-500 hover:border-[#1a7a4a] transition-colors">
                  <Upload size={16} />{file ? file.name : "Choose file"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
            <div><Label>Title *</Label><Input {...regUpload("title")} className="mt-1" required /></div>
            <div><Label>Category</Label><Input {...regUpload("category")} placeholder="general, eid, events..." className="mt-1" /></div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#1a7a4a] hover:bg-[#155f3a]" disabled={upload.isPending || !file}>
                {upload.isPending ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Edit Media</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit((d) => update.mutate(d))} className="space-y-4">
            <div><Label>Title</Label><Input {...regEdit("title")} className="mt-1" /></div>
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
    </div>
  );
}
