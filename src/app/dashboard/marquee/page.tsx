"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { MarqueeData } from "@/types";
import { PageHeader, BilingualInput } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

export default function MarqueePage() {
  const qc = useQueryClient();

  const { data, isLoading, isFetching, refetch } = useQuery<MarqueeData>({
    queryKey: ["marquee-admin"],
    queryFn: () => api.get("/marquee").then((r) => r.data.data),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });

  const { register, handleSubmit, reset } = useForm<MarqueeData>();
  useEffect(() => { if (data) reset(data); }, [data, reset]);

  const save = useMutation({
    mutationFn: (d: MarqueeData) => api.put("/marquee", d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["marquee-admin"] });
      qc.invalidateQueries({ queryKey: ["marquee"] });
      swal.success("Marquee Updated!");
    },
    onError: () => swal.error("Failed to save"),
  });

  if (isLoading) return <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />;

  return (
    <div>
      <PageHeader
        title="Marquee Ticker"
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          </Button>
        }
      />
      <form onSubmit={handleSubmit((d) => save.mutate(d))} className="bg-white rounded-xl p-6 shadow-sm border space-y-5 max-w-2xl">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Ticker Text</Label>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">English</Label>
              <Input {...register("text.en")} placeholder="English..." />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">বাংলা</Label>
              <Input {...register("text.bn")} placeholder="বাংলা..." />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" {...register("isActive")} className="w-4 h-4 accent-[#1a7a4a]" />
          <Label htmlFor="isActive">Active (show on website)</Label>
        </div>

        <Button type="submit" className="bg-[#1a7a4a] hover:bg-[#155f3a]" disabled={save.isPending}>
          {save.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
