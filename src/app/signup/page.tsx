'use client';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Signup() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [touched, setTouched] = useState({ username: false, email: false, password: false });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = { username: "", email: "", password: "" };

    if (!user.username) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z\s]+$/.test(user.username)) {
      newErrors.username = 'Username must contain only letters and spaces';
    } else if (user.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }

    if (!user.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!user.password) {
      newErrors.password = 'Password is required';
    } else {
      if (user.password.length < 8) newErrors.password += 'Min 8 characters. ';
      if (!/[A-Z]/.test(user.password)) newErrors.password += 'One uppercase. ';
      if (!/[a-z]/.test(user.password)) newErrors.password += 'One lowercase. ';
      if (!/\d/.test(user.password)) newErrors.password += 'One number. ';
      if (!/[@$!%*?&]/.test(user.password)) newErrors.password += 'One special char (@$!%*?&). ';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  useEffect(() => {
    setButtonDisabled(!validate());
  }, [user]);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      toast.success("Signup successful", { duration: 4000 });
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Signup failed", { duration: 4000 });
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

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <svg className="animate-spin h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/auth_bg.png" alt="Background" className="w-full h-full object-cover opacity-10" />
      </div>

      {/* Auth Container */}
      <div className="z-10 flex flex-col lg:flex-row items-stretch w-full max-w-6xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-md">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 bg-white/10 text-white p-6 sm:p-8 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">Create Account</h1>

          <form className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
              <input
                id="username"
                type="text"
                placeholder="John Doe"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                onBlur={() => handleBlur('username')}
                disabled={loading}
                className="w-full p-2 rounded-lg border border-gray-500 bg-black bg-opacity-30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              {touched.username && errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                onBlur={() => handleBlur('email')}
                disabled={loading}
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
                onBlur={() => handleBlur('password')}
                disabled={loading}
                className="w-full p-2 rounded-lg border border-gray-500 bg-black bg-opacity-30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <button
              type="button"
              onClick={onSignup}
              disabled={buttonDisabled || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 p-2 rounded-lg text-white font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-300">Already have an account?</span>{" "}
            <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
          </div>
        </div>

        {/* Image Section - hidden on small screens */}
        <div className="hidden lg:flex lg:w-1/2 bg-black bg-opacity-20 items-center justify-center">
          <img
            src="https://img.freepik.com/premium-vector/lawyer-s-office-with-desk-bookshelf-vector-design_1045156-7143.jpg"
            alt="Signup Illustration"
            className="max-h-[90vh] object-cover shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
