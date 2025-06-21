'use client';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = { email: "", password: "" };

    if (!user.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!user.password) {
      newErrors.password = "Password is required";
    } else {
      if (user.password.length < 8) newErrors.password += "Min 8 characters. ";
      if (!/[A-Z]/.test(user.password)) newErrors.password += "One uppercase. ";
      if (!/[a-z]/.test(user.password)) newErrors.password += "One lowercase. ";
      if (!/\d/.test(user.password)) newErrors.password += "One number. ";
      if (!/[@$!%*?&]/.test(user.password)) newErrors.password += "One special char. ";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  useEffect(() => {
    setButtonDisabled(!validate());
  }, [user]);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/admin/login", user);
      toast.success(response.data.message);
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 sm:p-6">
      <Toaster position="top-center" />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/auth_bg.png" alt="Background" className="w-full h-full object-cover opacity-10" />
      </div>

      {/* Main Auth Box */}
      <div className="z-10 flex flex-col lg:flex-row items-stretch w-full max-w-5xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-md">
        
        {/* Form Section */}
        <div className="w-full lg:w-1/2 bg-white/10 text-white p-6 sm:p-8 flex flex-col justify-center ">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">Admin Login</h1>

          <form className="space-y-5 "  >
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="text"
                placeholder="admin@example.com"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                onBlur={() => handleBlur("email")}
                className="w-full p-2 rounded-lg border border-gray-500 bg-black bg-opacity-30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                id="password"
                type="password"
                placeholder="********"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                onBlur={() => handleBlur("password")}
                className="w-full p-2 rounded-lg border border-gray-500 bg-black bg-opacity-30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={onLogin}
              disabled={buttonDisabled || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 p-2 rounded-lg text-white font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-300">Not an admin? </span>
            <Link href="/login" className="text-blue-400 hover:underline">User Login</Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-black bg-opacity-20 items-center justify-center">
          <img
            src="https://admin.hiims.in/public/riktheme/img/bg-img/6.png"
            alt="Admin Illustration"
            className="max-h-[90vh] object-cover shadow-2xl w-full"
          />
        </div>
      </div>
    </div>
  );
}
