"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { BlogPost, PaginatedData } from "@/types";
import { PageHeader, BilingualInput, ImageUpload } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, RefreshCw, ImageOff, CalendarDays, Tag, User, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";

type FormValues = {
  title: { en: string; bn: string };
  description: { en: string; bn: string };
  author: { en: string; bn: string };
  category: { en: string; bn: string };
  date: string;
  isActive: boolean;
};

export default function BlogPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<BlogPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedData<BlogPost>>({
    queryKey: ["blog-admin", page],
    queryFn: () => api.get(`/blog?page=${page}&limit=10&all=true`).then((r) => r.data.data),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const blank: FormValues = {
    title: { en: "", bn: "" },
    description: { en: "", bn: "" },
    author: { en: "", bn: "" },
    category: { en: "", bn: "" },
    date: "",
    isActive: true,
  };

  const openCreate = () => {
    setEditItem(null);
    reset(blank);
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (b: BlogPost) => {
    setEditItem(b);
    reset({
      title: b.title,
      description: b.description,
      author: b.author,
      category: typeof b.category === "object" ? b.category : { en: b.category ?? "", bn: b.category ?? "" },
      date: b.createdAt?.slice(0, 10) ?? "",
      isActive: b.isActive,
    });
    setImageFile(null);
    setDialogOpen(true);
  };

  const toggleActive = useMutation({
    mutationFn: (b: BlogPost) => api.put(`/blog/${b._id}`, { isActive: !b.isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog-admin"] });
      qc.invalidateQueries({ queryKey: ["blog-home"] });
    },
    onError: () => swal.error("Failed to update status"),
  });

  const save = useMutation({
    mutationFn: (d: FormValues) => {
      const fd = new FormData();
      if (imageFile) fd.append("image", imageFile);
      fd.append("title", JSON.stringify(d.title));
      fd.append("description", JSON.stringify(d.description));
      fd.append("author", JSON.stringify(d.author));
      fd.append("category", JSON.stringify(d.category));
      fd.append("date", new Date(d.date).toISOString());
      fd.append("isActive", String(d.isActive));
      return editItem ? api.put(`/blog/${editItem._id}`, fd) : api.post("/blog", fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog-admin"] });
      qc.invalidateQueries({ queryKey: ["blog-home"] });
      setDialogOpen(false);
      swal.success(editItem ? "Blog Updated!" : "Blog Created!");
    },
    onError: () => swal.error("Failed to save"),
  });

  const handleDelete = async (b: BlogPost) => {
    const result = await swal.confirmDelete(b.title.en);
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/blog/${b._id}`);
      qc.invalidateQueries({ queryKey: ["blog-admin"] });
      qc.invalidateQueries({ queryKey: ["blog-home"] });
      swal.success("Deleted!");
    } catch {
      swal.error("Delete Failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button onClick={openCreate} className="bg-[#1a7a4a] hover:bg-[#155f3a]">
              <Plus size={16} className="mr-1" /> Add Post
            </Button>
          </div>
        }
      />

      <div className="space-y-3">
        {isLoading
          ? [1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)
          : data?.data.length === 0
          ? <div className="py-20 text-center text-gray-400">No blog posts found</div>
          : data?.data.map((b) => (
              <div key={b._id} className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4 items-start">
                <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border bg-gray-50 flex items-center justify-center">
                  {b.imageUrl ? (
                    <Image src={b.imageUrl} alt={b.title.en} width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <ImageOff size={22} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-gray-800 text-sm leading-snug truncate">{b.title.en}</h3>
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      b.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}>{b.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  {b.title.bn && <p className="text-xs text-gray-400 truncate">{b.title.bn}</p>}
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{b.description.en}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <User size={11} className="text-[#1a7a4a]" /> {b.author.en}
                    </span>
                    {b.category && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Tag size={11} className="text-[#1a7a4a]" /> {typeof b.category === "object" ? b.category.en : b.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <CalendarDays size={11} className="text-[#1a7a4a]" />
                      {new Date(b.createdAt).toLocaleDateString("en-BD", { dateStyle: "medium" })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => openEdit(b)} className="text-xs px-3">
                    <Pencil size={13} className="mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleActive.mutate(b)}
                    className={`text-xs px-3 ${ b.isActive ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50" }`}>
                    {b.isActive ? <ToggleRight size={13} className="mr-1" /> : <ToggleLeft size={13} className="mr-1" />}
                    {b.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(b)} className="text-red-500 hover:bg-red-50 text-xs px-3">
                    <Trash2 size={13} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
      </div>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-5 text-sm text-gray-500">
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className={`-mx-6 -mt-6 px-6 py-4 border-b mb-4 ${editItem ? "bg-gradient-to-r from-[#1a7a4a]/10 to-emerald-50" : "bg-gradient-to-r from-blue-50 to-indigo-50"}`}>
            <DialogTitle className="text-base font-bold text-gray-800">
              {editItem ? "✏️ Edit Blog Post" : "➕ Add New Blog Post"}
            </DialogTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              {editItem ? `Editing: ${editItem.title.en}` : "Fill in the details to create a new blog post"}
            </p>
          </div>

          <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
            <ImageUpload
              label="Cover Image"
              currentUrl={editItem?.imageUrl}
              onChange={setImageFile}
            />
            <BilingualInput label="Title *" nameEn="title.en" nameBn="title.bn" register={register} />
            <BilingualInput label="Description *" nameEn="description.en" nameBn="description.bn" register={register} textarea />
            <BilingualInput label="Author *" nameEn="author.en" nameBn="author.bn" register={register} />
            <BilingualInput label="Category *" nameEn="category.en" nameBn="category.bn" register={register} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <Label>Date *</Label>
                <Input type="date" {...register("date")} className="mt-1" required />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <input type="checkbox" id="isActive" {...register("isActive")} className="w-4 h-4 accent-[#1a7a4a]" />
                <Label htmlFor="isActive">Active (visible on website)</Label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="px-6">Cancel</Button>
              <Button type="submit" className="bg-[#1a7a4a] hover:bg-[#155f3a] px-6" disabled={save.isPending}>
                {save.isPending ? "Saving..." : editItem ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
