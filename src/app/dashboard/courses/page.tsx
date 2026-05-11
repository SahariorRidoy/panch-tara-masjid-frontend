"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { Course, PaginatedData } from "@/types";
import { PageHeader, ImageUpload, BilingualInput } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

type FormValues = {
  title: { en: string; bn: string };
  description: { en: string; bn: string };
  teacher: { name: { en: string; bn: string } };
  status: "active" | "inactive";
};

const blank: FormValues = {
  title: { en: "", bn: "" }, description: { en: "", bn: "" },
  teacher: { name: { en: "", bn: "" } },
  status: "active",
};

export default function CoursesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedData<Course>>({
    queryKey: ["courses-admin", page],
    queryFn: () => api.get(`/courses?page=${page}&limit=10`).then((r) => r.data.data),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  const { register, handleSubmit, reset, control } = useForm<FormValues>();

  const openCreate = () => { setEditItem(null); reset(blank); setImageFile(null); setDialogOpen(true); };
  const openEdit = (c: Course) => { setEditItem(c); reset(c); setImageFile(null); setDialogOpen(true); };

  const save = useMutation({
    mutationFn: (d: FormValues) => {
      const fd = new FormData();
      if (imageFile) fd.append("image", imageFile);
      (["title", "description", "teacher"] as const).forEach((k) =>
        fd.append(k, JSON.stringify(d[k]))
      );
      fd.append("status", d.status);
      return editItem ? api.put(`/courses/${editItem._id}`, fd) : api.post("/courses", fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses-admin"] });
      qc.invalidateQueries({ queryKey: ["courses-home"] });
      setDialogOpen(false);
      swal.success(editItem ? "Course Updated!" : "Course Created!");
    },
    onError: () => swal.error("Failed to save"),
  });

  const handleDelete = async (c: Course) => {
    const result = await swal.confirmDelete(c.title.en);
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/courses/${c._id}`);
      qc.invalidateQueries({ queryKey: ["courses-admin"] });
      qc.invalidateQueries({ queryKey: ["courses-home"] });
      swal.success("Deleted!");
    } catch {
      swal.error("Delete Failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Courses"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button onClick={openCreate} className="bg-[#1a7a4a] hover:bg-[#155f3a]">
              <Plus size={16} className="mr-1" />Add Course
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-40 bg-gray-100 rounded animate-pulse" />)}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
            {data?.data.map((c) => (
              <div key={c._id} className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {c.imageUrl && (
                  <div className="relative w-full h-24 bg-gray-100">
                    <img src={c.imageUrl} alt={c.title.en} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-2">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{c.title.en}</h3>
                  <p className="text-xs text-gray-500 mb-2">{c.teacher.name.en}</p>
                  <Badge className={c.status === "active" ? "bg-green-100 text-green-700 text-xs" : "bg-gray-100 text-gray-600 text-xs"}>
                    {c.status}
                  </Badge>
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => openEdit(c)}><Pencil size={12} /></Button>
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-red-500" onClick={() => handleDelete(c)}><Trash2 size={12} /></Button>
                  </div>
                </div>
              </div>
            ))}
            {data?.data.length === 0 && (
              <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 text-center py-8 text-gray-400">No courses found</div>
            )}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit Course" : "Add Course"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
            <ImageUpload currentUrl={editItem?.imageUrl} onChange={setImageFile} />
            <BilingualInput label="Title *" nameEn="title.en" nameBn="title.bn" register={register} />
            <BilingualInput label="Description *" nameEn="description.en" nameBn="description.bn" register={register} textarea />
            <BilingualInput label="Teacher Name *" nameEn="teacher.name.en" nameBn="teacher.name.bn" register={register} />
            <div>
              <Label>Status</Label>
              <Controller control={control} name="status" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#1a7a4a] hover:bg-[#155f3a]" disabled={save.isPending}>
                {save.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
