"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux";
import { setUser } from "@/store/authSlice";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [lottieData, setLottieData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/mosque.json")
      .then((r) => r.json())
      .then(setLottieData)
      .catch(() => null);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    shouldUnregister: false,
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) => api.post("/auth/login", data).then((r) => r.data),
    onSuccess: (res) => {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      document.cookie = `accessToken=${res.data.accessToken}; path=/; SameSite=Strict`;
      dispatch(setUser(res.data.user));
      swal.success("Welcome Back!", `Assalamu Alaikum, ${res.data.user.name}`).then(() => {
        router.push("/dashboard");
      });
    },
    onError: () => { void swal.error("Login Failed", "Invalid email or password. Please try again."); },
  });

  return (
    <div className="min-h-dvh flex bg-gradient-to-br from-[#0a2e1a] via-[#0f4a2a] to-[#0a2e1a] bg-fixed">

      {/* ── Left Panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex flex-col items-center justify-center w-1/2 px-16 relative overflow-hidden"
      >
        {/* Glow blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        {/* Lottie */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="w-80 h-80 relative z-10"
        >
          {lottieData ? (
            <Lottie animationData={lottieData} loop autoplay style={{ width: "100%", height: "100%" }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="w-12 h-12 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full block"
              />
            </div>
          )}
        </motion.div>

        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center relative z-10 mt-2"
        >
          <h2 className="text-3xl font-bold text-white leading-tight">
            {process.env.NEXT_PUBLIC_APP_NAME ?? "Panch Tara Jame Masjid"}
          </h2>
          <p className="text-emerald-300/80 mt-2 text-sm tracking-[0.2em] uppercase font-medium">
            Admin Portal
          </p>
          <div className="mt-5 flex items-center justify-center gap-2 text-white/50 text-sm">
            <ShieldCheck size={15} className="text-emerald-400" />
            <span>Secure · Trusted · Transparent</span>
          </div>
        </motion.div>

        {/* Animated pulse dots */}
        <div className="absolute bottom-10 flex gap-2.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
              className="w-2 h-2 rounded-full bg-emerald-400"
            />
          ))}
        </div>
      </motion.div>

      {/* ── Right Panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-1 items-center justify-center px-6 py-12"
      >
        <div className="w-full max-w-md">
          <div className="bg-white/[0.97] backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/40 p-8 border border-white/10">

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a7a4a] to-[#0d5c35] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl shadow-emerald-900/40"
              >
                م
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
              <p className="text-gray-500 text-sm mt-1">Sign in to your admin account</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit((d) => mutate(d))(e); }} className="space-y-5" noValidate>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/80 focus:bg-white transition-all ${
                      errors.email ? "border-red-400 focus-visible:ring-red-200" : "focus-visible:ring-emerald-200 focus-visible:border-emerald-400"
                    }`}
                    placeholder="admin@masjid.com"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 flex items-center gap-1 mt-1"
                  >
                    ⚠ {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`pl-10 pr-11 h-11 rounded-xl border-gray-200 bg-gray-50/80 focus:bg-white transition-all ${
                      errors.password ? "border-red-400 focus-visible:ring-red-200" : "focus-visible:ring-emerald-200 focus-visible:border-emerald-400"
                    }`}
                    placeholder="Enter your password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 flex items-center gap-1 mt-1"
                  >
                    ⚠ {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Submit */}
              <motion.div whileTap={{ scale: 0.98 }} className="pt-1">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#1a7a4a] to-[#22a060] hover:from-[#155f3a] hover:to-[#1a7a4a] text-white font-semibold text-sm shadow-lg shadow-emerald-900/30 transition-all duration-200 cursor-pointer"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-500" />
                Protected by secure authentication
              </p>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Homepage
            </Link>
          </div>

          <p className="text-center text-white/30 text-xs mt-3">
            © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME ?? "Panch Tara Jame Masjid"}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
