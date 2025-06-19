'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const [user, setUser] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({ email: false, password: false });
    const [buttonDisabled, setButtonDisabled] = useState(true);
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
            if (user.password.length < 8) newErrors.password += "Min 8 chars. ";
            if (!/[A-Z]/.test(user.password)) newErrors.password += "One uppercase. ";
            if (!/[a-z]/.test(user.password)) newErrors.password += "One lowercase. ";
            if (!/\d/.test(user.password)) newErrors.password += "One number. ";
            if (!/[@$!%*?&]/.test(user.password)) newErrors.password += "One special char (@$!%*?&). ";
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((err) => err === "");
    };

    useEffect(() => {
        setButtonDisabled(!validate());
    }, [user]);

    const handleBlur = (field: keyof typeof touched) => {
        setTouched({ ...touched, [field]: true });
        validate();
    };

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            toast.success(response.data.message || "Login successful", { duration: 4000 });
            router.push("/");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Login failed", { duration: 4000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6">
            <Toaster position="top-center" />

            {/* Loading Spinner */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <svg className="animate-spin h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                </div>
            )}

            {/* Background Blur */}
            <div className="absolute inset-0">
                <img src="/auth_bg.png" alt="Background" className="w-full h-full object-cover opacity-10" />
            </div>

            <div className="z-10 flex flex-col lg:flex-row items-stretch w-full max-w-6xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-md">
                {/* Login Form */}
                <div className="w-full lg:w-1/2 bg-white/10 text-white p-6 sm:p-8 flex flex-col justify-center">

                    <h1 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h1>

                    <form className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                onBlur={() => handleBlur("email")}
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
                                onBlur={() => handleBlur("password")}
                                disabled={loading}
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

                    {/* Link to Signup */}
                    <div className="mt-6 text-center">
                        <span className="text-gray-300">Don't have an account?</span>{" "}
                        <Link href="/signup" className="text-blue-400 hover:underline">Sign Up</Link>
                    </div>

                </div>

                {/* Right Side Image */}
                <div className=" hidden lg:flex w-full lg:w-1/2 bg-black bg-opacity-20 flex items-center justify-center">
                    <img
                        src="https://img.freepik.com/premium-vector/lawyer-s-office-with-desk-bookshelf-vector-design_1045156-7143.jpg"
                        alt="Login Illustration"
                        className=" max-h-[90vh] object-cover shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
