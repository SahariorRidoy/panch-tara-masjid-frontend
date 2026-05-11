"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { HeroSlide } from "@/types";
import { PageHeader, ImageUpload, BilingualInput } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, RefreshCw, Images, Eye, EyeOff, GripVertical, Layers } from "lucide-react";
import Image from "next/image";

type FormValues = {
  title: { en: string; bn: string };
  tagline: { en: string; bn: string };
  order: number;
  isActive: boolean;
};

export default function HeroPage() {
  const qc = useQueryClient();
  const [editItem, setEditItem] = useState<HeroSlide | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewSlide, setPreviewSlide] = useState<HeroSlide | null>(null);

  const { data: slides = [], isLoading, isFetching, refetch } = useQuery<HeroSlide[]>({
    queryKey: ["hero-all"],
    queryFn: () => api.get("/hero/all").then((r) => r.data.data),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  const openCreate = () => {
    setEditItem(null);
    reset({ title: { en: "", bn: "" }, tagline: { en: "", bn: "" }, order: slides.length, isActive: true });
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (s: HeroSlide) => {
    setEditItem(s);
    reset({ title: s.title, tagline: s.tagline, order: s.order, isActive: s.isActive });
    setImageFile(null);
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: (data: FormValues) => {
      const fd = new FormData();
      if (imageFile) fd.append("image", imageFile);
      fd.append("title", JSON.stringify(data.title));
      fd.append("tagline", JSON.stringify(data.tagline));
      fd.append("order", String(data.order));
      fd.append("isActive", String(data.isActive));
      return editItem ? api.put(`/hero/${editItem._id}`, fd) : api.post("/hero", fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hero-all"] });
      qc.invalidateQueries({ queryKey: ["hero"] });
      setDialogOpen(false);
      swal.success(editItem ? "Slide Updated!" : "Slide Created!");
    },
    onError: () => swal.error("Failed to save", "Please try again."),
  });

  const handleDelete = async (slide: HeroSlide) => {
    const result = await swal.confirmDelete(slide.title.en);
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/hero/${slide._id}`);
      qc.invalidateQueries({ queryKey: ["hero-all"] });
      qc.invalidateQueries({ queryKey: ["hero"] });
      swal.success("Deleted!", "Slide has been removed.");
    } catch {
      swal.error("Delete Failed", "Please try again.");
    }
  };

  const activeCount = slides.filter((s) => s.isActive).length;
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Hero Carousel"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button onClick={openCreate} className="bg-[#1a7a4a] hover:bg-[#155f3a] gap-1.5">
              <Plus size={16} />Add Slide
            </Button>
          </div>
        }
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: <Layers size={18} />, label: "Total Slides", value: slides.length, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
          { icon: <Eye size={18} />, label: "Active", value: activeCount, color: "bg-blue-50 text-blue-700 border-blue-200" },
          { icon: <EyeOff size={18} />, label: "Inactive", value: slides.length - activeCount, color: "bg-gray-50 text-gray-600 border-gray-200" },
        ].map((stat) => (
          <div key={stat.label} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${stat.color}`}>
            <div className="opacity-70">{stat.icon}</div>
            <div>
              <p className="text-xs font-medium opacity-70">{stat.label}</p>
              <p className="text-xl font-bold leading-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Slides Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden border bg-white shadow-sm">
              <div className="h-44 bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedSlides.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400">
          <Images size={48} className="mb-3 opacity-40" />
          <p className="font-medium text-gray-500">No slides yet</p>
          <p className="text-sm mt-1">Click &quot;Add Slide&quot; to create your first hero banner</p>
          <Button onClick={openCreate} className="mt-4 bg-[#1a7a4a] hover:bg-[#155f3a] gap-1.5">
            <Plus size={16} />Add First Slide
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSlides.map((s) => (
            <div
              key={s._id}
              className="group relative rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Image */}
              <div className="relative h-44 bg-gradient-to-br from-emerald-50 to-teal-100 overflow-hidden">
                {s.imageUrl ? (
                  <Image
                    src={s.imageUrl}
                    alt={s.title.en}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Images size={40} className="text-emerald-300" />
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                {/* Order badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                  <GripVertical size={11} />#{s.order}
                </div>
                {/* Status badge */}
                <div className="absolute top-2 right-2">
                  <Badge className={s.isActive
                    ? "bg-emerald-500 text-white border-0 shadow-sm"
                    : "bg-gray-500 text-white border-0 shadow-sm"
                  }>
                    {s.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {/* Quick preview button */}
                <button
                  onClick={() => setPreviewSlide(s)}
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full shadow"
                >
                  Preview
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Banner Slide Text */}
                <div className="mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">Banner Slide Text</p>
                  <p className="font-semibold text-gray-800 text-sm leading-snug truncate">{s.title.en}</p>
                  <p className="text-xs text-gray-500 font-bengali truncate">{s.title.bn}</p>
                </div>
                <div className="mb-3 pl-3 border-l-2 border-emerald-200">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Tagline</p>
                  <p className="text-xs text-gray-600 truncate">{s.tagline.en}</p>
                  <p className="text-xs text-gray-400 font-bengali truncate">{s.tagline.bn}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1.5 text-xs hover:border-emerald-400 hover:text-emerald-700"
                    onClick={() => openEdit(s)}
                  >
                    <Pencil size={13} />Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50"
                    onClick={() => handleDelete(s)}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Images size={15} className="text-emerald-700" />
              </div>
              {editItem ? "Edit Hero Slide" : "Add New Hero Slide"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-5 pt-1">
            {/* Image Upload */}
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
              <ImageUpload currentUrl={editItem?.imageUrl} onChange={setImageFile} label="Slide Image" />
              <p className="text-xs text-gray-400 mt-2">Recommended: 1920×600px, JPG or PNG</p>
            </div>

            {/* Banner Slide Text Section */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-4 rounded-full bg-emerald-500" />
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Banner Slide Text</p>
              </div>
              <BilingualInput
                label="Title"
                nameEn="title.en"
                nameBn="title.bn"
                register={register}
                errors={errors}
              />
              <BilingualInput
                label="Tagline"
                nameEn="tagline.en"
                nameBn="tagline.bn"
                register={register}
                errors={errors}
              />
            </div>

            {/* Order & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Display Order</label>
                <input
                  type="number"
                  min={0}
                  {...register("order", { valueAsNumber: true })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">Lower = shown first</p>
              </div>
              <div className="flex flex-col justify-center">
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Visibility</label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isActive"
                      {...register("isActive")}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-checked:bg-emerald-500 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-emerald-300" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-800">Active on website</span>
                </label>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1a7a4a] hover:bg-[#155f3a] min-w-[100px]"
                disabled={save.isPending}
              >
                {save.isPending ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin" />Saving...
                  </span>
                ) : (
                  editItem ? "Update Slide" : "Create Slide"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={!!previewSlide} onOpenChange={() => setPreviewSlide(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-4 pb-0">
            <DialogTitle className="text-sm font-semibold text-gray-600">Slide Preview</DialogTitle>
          </DialogHeader>
          {previewSlide && (
            <div>
              <div className="relative h-56 sm:h-72 bg-gradient-to-br from-emerald-800 to-teal-900 mx-4 mb-4 mt-3 rounded-xl overflow-hidden">
                {previewSlide.imageUrl && (
                  <Image src={previewSlide.imageUrl} alt={previewSlide.title.en} fill className="object-cover opacity-70" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-lg sm:text-2xl font-bold leading-tight drop-shadow">{previewSlide.title.en}</p>
                  <p className="text-sm sm:text-base opacity-80 mt-1 drop-shadow">{previewSlide.tagline.en}</p>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className={previewSlide.isActive ? "bg-emerald-500 text-white border-0" : "bg-gray-500 text-white border-0"}>
                    {previewSlide.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Bengali Title</p>
                  <p className="font-medium text-gray-700">{previewSlide.title.bn}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Bengali Tagline</p>
                  <p className="font-medium text-gray-700">{previewSlide.tagline.bn}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
