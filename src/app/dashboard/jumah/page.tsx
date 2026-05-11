"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { JumahData } from "@/types";
import { PageHeader } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, RefreshCw } from "lucide-react";

export default function JumahPage() {
  const qc = useQueryClient();

  const { data, isLoading, isFetching, refetch } = useQuery<JumahData>({
    queryKey: ["jumah-admin"],
    queryFn: () => api.get("/jumah/admin").then((r) => r.data.data),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });

  const { register, handleSubmit, reset, control } = useForm<JumahData>();
  const { fields, append, remove } = useFieldArray({ control, name: "sessions" });

  useEffect(() => { if (data) reset(data); }, [data, reset]);

  const save = useMutation({
    mutationFn: (d: JumahData) => api.put("/jumah", d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jumah-admin"] });
      swal.success("Jumu'ah Times Saved!");
    },
    onError: () => swal.error("Failed to save"),
  });

  if (isLoading) return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />;

  return (
    <div>
      <PageHeader
        title="Jumu'ah Times"
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          </Button>
        }
      />
      <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-5 max-w-3xl">
        {fields.map((field, i) => (
          <div key={field.id} className="bg-white rounded-xl p-5 shadow-sm border space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Session {i + 1}</h3>
              <Button type="button" size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => remove(i)}>
                <Trash2 size={14} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Label (EN)</Label><Input {...register(`sessions.${i}.label.en`)} className="mt-1" /></div>
              <div><Label>Label (BN)</Label><Input {...register(`sessions.${i}.label.bn`)} className="mt-1" /></div>
              <div><Label>Azan Time</Label><Input {...register(`sessions.${i}.azanTime`)} placeholder="12:45 PM" className="mt-1" /></div>
              <div><Label>Khutbah Time</Label><Input {...register(`sessions.${i}.khutbahTime`)} placeholder="01:00 PM" className="mt-1" /></div>
              <div><Label>Iqamah Time</Label><Input {...register(`sessions.${i}.iqamahTime`)} placeholder="01:15 PM" className="mt-1" /></div>
              <div className="flex items-end gap-2 pb-1">
                <input type="checkbox" id={`active-${i}`} {...register(`sessions.${i}.isActive`)} className="w-4 h-4 accent-[#1a7a4a]" />
                <Label htmlFor={`active-${i}`}>Active</Label>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ label: { en: "", bn: "" }, azanTime: "", khutbahTime: "", iqamahTime: "", isActive: true })}
        >
          <Plus size={16} className="mr-1" />Add Session
        </Button>

        <div className="bg-white rounded-xl p-5 shadow-sm border space-y-3">
          <h3 className="font-semibold text-gray-700">Note</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Note (EN)</Label><Input {...register("note.en")} className="mt-1" /></div>
            <div><Label>Note (BN)</Label><Input {...register("note.bn")} className="mt-1" /></div>
          </div>
        </div>

        <Button type="submit" className="bg-[#1a7a4a] hover:bg-[#155f3a]" disabled={save.isPending}>
          {save.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
