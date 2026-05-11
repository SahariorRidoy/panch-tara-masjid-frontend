"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { Event, PaginatedData } from "@/types";
import { PageHeader, BilingualInput, MultiImageUpload } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, RefreshCw, CalendarDays, MapPin, ImageOff, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  upcoming:  "bg-blue-50 text-blue-700 border border-blue-200",
  ongoing:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  completed: "bg-gray-100 text-gray-500 border border-gray-200",
  cancelled: "bg-red-50 text-red-600 border border-red-200",
};

type FormValues = {
  title: { en: string; bn: string };
  description: { en: string; bn: string };
  date: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
};

function ImageStrip({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!images.length)
    return (
      <div className="w-24 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">
        <ImageOff size={20} />
      </div>
    );

  return (
    <>
      <div className="flex gap-1.5 flex-wrap">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightbox(i)}
            className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 hover:ring-2 hover:ring-[#1a7a4a] transition shrink-0"
          >
            <Image src={src} alt={`img-${i}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white"
            onClick={(ev) => { ev.stopPropagation(); setLightbox((i) => (i! - 1 + images.length) % images.length); }}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="relative w-[90vw] max-w-3xl h-[70vh]" onClick={(ev) => ev.stopPropagation()}>
            <Image src={images[lightbox]} alt="preview" fill className="object-contain rounded-xl" />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white"
            onClick={(ev) => { ev.stopPropagation(); setLightbox((i) => (i! + 1) % images.length); }}
          >
            <ChevronRight size={24} />
          </button>
          <span className="absolute bottom-4 text-white/70 text-sm">{lightbox + 1} / {images.length}</span>
        </div>
      )}
    </>
  );
}

export default function EventsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedData<Event>>({
    queryKey: ["events-admin", page],
    queryFn: () => api.get(`/events?page=${page}&limit=10`).then((r) => r.data.data),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });

  const { register, handleSubmit, reset, control } = useForm<FormValues>();

  const openCreate = () => {
    setEditItem(null);
    reset({ title: { en: "", bn: "" }, description: { en: "", bn: "" }, date: "", status: "upcoming" });
    setImageFiles([]);
    setDialogOpen(true);
  };

  const openEdit = (e: Event) => {
    setEditItem(e);
    reset({ title: e.title, description: e.description, date: e.date.slice(0, 16), status: e.status });
    setImageFiles([]);
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: (d: FormValues) => {
      const fd = new FormData();
      imageFiles.forEach((f) => fd.append("images", f));
      fd.append("title", JSON.stringify(d.title));
      fd.append("description", JSON.stringify(d.description));
      fd.append("date", new Date(d.date).toISOString());
      fd.append("status", d.status);
      return editItem ? api.put(`/events/${editItem._id}`, fd) : api.post("/events", fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events-admin"] });
      qc.invalidateQueries({ queryKey: ["events-home"] });
      setDialogOpen(false);
      swal.success(editItem ? "Event Updated!" : "Event Created!");
    },
    onError: () => swal.error("Failed to save", "Please try again."),
  });

  const handleDelete = async (ev: Event) => {
    const result = await swal.confirmDelete(ev.title.en);
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/events/${ev._id}`);
      qc.invalidateQueries({ queryKey: ["events-admin"] });
      qc.invalidateQueries({ queryKey: ["events-home"] });
      swal.success("Deleted!");
    } catch {
      swal.error("Delete Failed");
    }
  };

  const getImages = (e: Event) =>
    e.images?.length ? e.images : e.imageUrl ? [e.imageUrl] : [];

  return (
    <div>
      <PageHeader
        title="Events"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button onClick={openCreate} className="bg-[#1a7a4a] hover:bg-[#155f3a]">
              <Plus size={16} className="mr-1" /> Add Event
            </Button>
          </div>
        }
      />

      {/* List */}
      <div className="space-y-3">
        {isLoading
          ? [1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)
          : data?.data.length === 0
          ? <div className="py-20 text-center text-gray-400">No events found</div>
          : data?.data.map((e) => {
              const imgs = getImages(e);
              return (
                <div key={e._id} className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4 items-start">

                  {/* Left — info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[e.status]}`}>
                        {e.status}
                      </span>
                      <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                        {imgs.length} photo{imgs.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800 text-sm leading-snug">{e.title.en}</h3>
                    {e.title.bn && <p className="text-xs text-gray-400">{e.title.bn}</p>}

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{e.description.en}</p>

                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <CalendarDays size={11} className="text-[#1a7a4a]" />
                        {new Date(e.date).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                      {e.location?.en && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={11} className="text-[#1a7a4a]" />
                          {e.location.en}
                        </span>
                      )}
                    </div>

                    {/* Image strip */}
                    <div className="mt-3">
                      <ImageStrip images={imgs} />
                    </div>
                  </div>

                  {/* Right — actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => openEdit(e)} className="text-xs px-3">
                      <Pencil size={13} className="mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(e)} className="text-red-500 hover:bg-red-50 hover:text-red-600 text-xs px-3">
                      <Trash2 size={13} className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Pagination */}
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
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className={`-mx-6 -mt-6 px-6 py-4 border-b mb-4 ${ editItem ? "bg-gradient-to-r from-[#1a7a4a]/10 to-emerald-50" : "bg-gradient-to-r from-blue-50 to-indigo-50" }`}>
            <DialogTitle className="text-base font-bold text-gray-800">
              {editItem ? "✏️ Edit Event" : "➕ Add New Event"}
            </DialogTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              {editItem ? `Editing: ${editItem.title.en}` : "Fill in the details to create a new event"}
            </p>
          </div>

          <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
            <MultiImageUpload
              label="Event Images (up to 10)"
              currentUrls={editItem?.images ?? (editItem?.imageUrl ? [editItem.imageUrl] : [])}
              onChange={setImageFiles}
              max={10}
            />
            <BilingualInput label="Title *" nameEn="title.en" nameBn="title.bn" register={register} />
            <BilingualInput label="Description *" nameEn="description.en" nameBn="description.bn" register={register} textarea />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Date & Time *</Label>
                <Input type="datetime-local" {...register("date")} className="mt-1" required />
              </div>
              <div>
                <Label>Status</Label>
                <Controller control={control} name="status" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["upcoming", "ongoing", "completed", "cancelled"].map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="px-6">Cancel</Button>
              <Button type="submit" className="bg-[#1a7a4a] hover:bg-[#155f3a] px-6" disabled={save.isPending}>
                {save.isPending ? "Saving..." : editItem ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
