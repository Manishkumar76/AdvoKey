'use client'; // This file is client-side only
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast, { Toaster } from "react-hot-toast"; // Import Toaster
import bg from "../assets/images/Bg_image.jpeg";
import Image from "next/image";

export default function Login() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {
            email: "",
            password: "",
        };

        // Email validation
        if (!user.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password validation
        if (!user.password) {
            newErrors.password = 'Password is required';
        } else {
            if (user.password.length < 8) {
                newErrors.password += 'Password must be at least 8 characters. ';
            }
            if (!/[A-Z]/.test(user.password)) {
                newErrors.password += 'Must include at least one uppercase letter. ';
            }
            if (!/[a-z]/.test(user.password)) {
                newErrors.password += 'Must include at least one lowercase letter. ';
            }
            if (!/\d/.test(user.password)) {
                newErrors.password += 'Must include at least one number. ';
            }
            if (!/[@$!%*?&]/.test(user.password)) {
                newErrors.password += 'Must include at least one special character (@$!%*?&). ';
            }
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    useEffect(() => {
        const isValid = validate();
        setButtonDisabled(!isValid);
    }, [user]);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            toast.success(response.data.message); // This should work now
            // console.log("Login successful", response.data);

            router.push("/"); // Redirect to home page after login
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Login failed"); // This should work now
            // console.error("Login error:", error.message);
            setButtonDisabled(false);
        } finally {
            setLoading(false);
            setButtonDisabled(false);
        }
    };

    const handleBlur = (field: any) => {
        setTouched({ ...touched, [field]: true });
        validate();
    };

    // GSAP Cursor Effect
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const mousemove = (e: any) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', mousemove);
        return () => window.removeEventListener('mousemove', mousemove);
    }, []);

    useGSAP(() => {
        gsap.to('.cursor', {
            x: mousePosition.x,
            y: mousePosition.y,
            ease: "power2.out",
            duration: 0.3
        });
    }, [mousePosition]);

    return (
        <div className="h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
            {/* Add the Toaster component */}
            <Toaster position="top-center" />

            {/* Animated Cursor */}
            <div className="cursor w-6 h-6 rounded-full bg-white fixed z-50 "></div>
            <div className={`h-screen flex items-center justify-center relative `}>
                <img src="/auth_bg.png" alt="" className="h-screen absolute w-full " />
                {
   loading && (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <svg className="animate-spin h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  )}


                <div className="flex flex-col items-center w-96 p-6 rounded-lg shadow-lg bg-gray-600 text-white shadow-blue-600 bg-opacity-10 backdrop-blur">
                    <h1 className="text-xl font-bold mb-4">Login</h1>

                    <input
                        className="w-full p-2 border border-gray-600 rounded-lg mb-4 bg-gray-700 focus:outline-none focus:border-blue-400"
                        id="email"
                        type="text"
                        placeholder="Email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        onBlur={() => handleBlur('email')}
                    />
                    {touched.email && errors.email && (
                        <div className="text-red-500 text-sm mb-2">{errors.email}</div>
                    )}

                    <input
                        className="w-full p-2 border border-gray-600 rounded-lg mb-4 bg-gray-700 focus:outline-none focus:border-blue-400"
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        onBlur={() => handleBlur('password')}
                    />
                    {touched.password && errors.password && (
                        <div className="text-red-500 text-sm mb-2">{errors.password}</div>
                    )}

                    <button
                        disabled={buttonDisabled}
                        className="w-full p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        onClick={onLogin}
                    >
                        Login
                    </button>
                    <div className="my-2 py-2">
                        <span>Don't have an account? </span>
                        <Link className="text-blue-400 mt-4 hover:underline" href="/signup">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}