"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { User, PaginatedData } from "@/types";
import { useAppSelector } from "@/hooks/redux";
import { PageHeader } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

type CreateForm = { name: string; email: string; password: string; role: "admin" | "committee" };
type EditForm = { name: string; email: string; role: "admin" | "committee" };

export default function UsersPage() {
  const router = useRouter();
  const currentUser = useAppSelector((s) => s.auth.user);

  if (currentUser && currentUser.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedData<User>>({
    queryKey: ["users-admin", page],
    queryFn: () => api.get(`/users?page=${page}&limit=10`).then((r) => r.data.data),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  const { register: regCreate, handleSubmit: handleCreate, reset: resetCreate, control: ctrlCreate } = useForm<CreateForm>();
  const { register: regEdit, handleSubmit: handleEditSubmit, reset: resetEdit, control: ctrlEdit } = useForm<EditForm>();

  const create = useMutation({
    mutationFn: (d: CreateForm) => api.post("/users", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users-admin"] }); setCreateOpen(false); resetCreate(); swal.success("User Created!"); },
    onError: () => swal.error("Failed to create user"),
  });

  const update = useMutation({
    mutationFn: (d: EditForm) => api.put(`/users/${editItem?._id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users-admin"] }); setEditItem(null); swal.success("Updated!"); },
    onError: () => swal.error("Failed to update"),
  });

  const handleDelete = async (u: User) => {
    if (u._id === currentUser?._id) { swal.error("Cannot delete yourself"); return; }
    const result = await swal.confirmDelete(u.name);
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/users/${u._id}`);
      qc.invalidateQueries({ queryKey: ["users-admin"] });
      swal.success("Deleted!");
    } catch {
      swal.error("Delete Failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Users"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button onClick={() => setCreateOpen(true)} className="bg-[#1a7a4a] hover:bg-[#155f3a]">
              <Plus size={16} className="mr-1" />Add User
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
      ) : (
        <div className="overflow-x-auto">
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden min-w-[480px]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{["Name", "Email", "Role", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {data?.data.map((u) => (
                <tr key={u._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge className={u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditItem(u); resetEdit({ name: u.name, email: u.email, role: u.role }); }}>
                        <Pencil size={14} />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDelete(u)} disabled={u._id === currentUser?._id}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {data?.data.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
          {data?.pagination && (
            <div className="flex justify-between items-center px-4 py-3 border-t text-sm text-gray-500">
              <span>Page {data.pagination.page} of {data.pagination.totalPages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <Button size="sm" variant="outline" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </div>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add User</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate((d) => create.mutate(d))} className="space-y-4">
            <div><Label>Name *</Label><Input {...regCreate("name")} className="mt-1" required /></div>
            <div><Label>Email *</Label><Input type="email" {...regCreate("email")} className="mt-1" required /></div>
            <div><Label>Password *</Label><Input type="password" {...regCreate("password")} className="mt-1" required /></div>
            <div>
              <Label>Role</Label>
              <Controller control={ctrlCreate} name="role" defaultValue="committee" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="committee">Committee</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#1a7a4a] hover:bg-[#155f3a]" disabled={create.isPending}>
                {create.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <form onSubmit={handleEditSubmit((d) => update.mutate(d))} className="space-y-4">
            <div><Label>Name</Label><Input {...regEdit("name")} className="mt-1" /></div>
            <div><Label>Email</Label><Input type="email" {...regEdit("email")} className="mt-1" /></div>
            <div>
              <Label>Role</Label>
              <Controller control={ctrlEdit} name="role" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="committee">Committee</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
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
