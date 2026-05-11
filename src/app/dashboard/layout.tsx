"use client";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setUser, clearUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import Sidebar from "@/components/admin/Sidebar";
import { Menu, ExternalLink, LogOut } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { mutate: logout } = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSettled: () => {
      localStorage.clear();
      document.cookie = "accessToken=; Max-Age=0; path=/";
      dispatch(clearUser());
      router.push("/login");
      toast.success("Logged out");
    },
  });

  const { data, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then((r) => r.data.data),
    retry: false,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
  });

  useEffect(() => { if (data) dispatch(setUser(data)); }, [data, dispatch]);

  useEffect(() => {
    if (isError) { dispatch(clearUser()); router.push("/login"); }
  }, [isError, dispatch, router]);

  useEffect(() => {
    if (!isAuthenticated && !data) {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (!token) router.push("/login");
    }
  }, [isAuthenticated, data, router]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar onClose={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#1a7a4a] border-b border-[#155f3a] px-4 h-14 flex items-center gap-3 shrink-0">
          <button className="md:hidden text-white" onClick={() => setSheetOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="text-xs sm:text-lg font-semibold text-white">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-white/30 hover:bg-white/10 transition-colors">
              <ExternalLink size={13} />
              Home
            </Link>
            <button onClick={() => logout()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium  bg-red-800 text-white border cursor-pointer border-white/30 hover:bg-red-900 transition-colors">
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
