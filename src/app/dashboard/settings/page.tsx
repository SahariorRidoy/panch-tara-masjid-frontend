"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { PageHeader } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/hooks/redux";

const schema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(8, "Min 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (d: FormValues) =>
      api.patch("/users/me/password", { currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => { reset(); swal.success("Password Changed!", "Your password has been updated successfully."); },
    onError: () => swal.error("Failed to Change Password", "Please check your current password and try again."),
  });

  return (
    <div>
      <PageHeader title="Change Password" />
      <div className="bg-white rounded-xl p-6 shadow-sm border max-w-md">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <div className="w-12 h-12 rounded-full bg-[#1a7a4a] flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.[0] ?? "A"}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input type="password" {...register("currentPassword")} className="mt-1" />
            {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" {...register("newPassword")} className="mt-1" />
            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input type="password" {...register("confirmPassword")} className="mt-1" />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-[#1a7a4a] hover:bg-[#155f3a]" disabled={isPending}>
            {isPending ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
