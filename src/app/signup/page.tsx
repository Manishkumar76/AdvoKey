'use client'; // This file is client-side only
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Signup() {
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: ""
    });

    const router = useRouter();

    const onSignup = async () => {
        try {
            const response = await axios.post("/api/signup", user);
            console.log("Signup successful", response.data);
            router.push("/login"); // Redirect to login page after signup
        } catch (error) {
            console.error("Signup error", error.response?.data || error.message);
        }
    };

    // GSAP Cursor Effect
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const mousemove = (e) => {
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
        <div>
             {/* Animated Cursor */}
            <div className="cursor w-6 h-6 rounded-full bg-white fixed z-50 pointer-events-none"></div>
<div className="h-screen bg-gray-900 flex items-center justify-center relative">
           

           <div className="flex flex-col items-center w-96 p-6 rounded-lg shadow-lg bg-gray-800 text-white shadow-blue-500">
               <h1 className="text-xl font-bold mb-4">Signup Page</h1>

               <input 
                   className="w-full p-2 border border-gray-600 rounded-lg mb-4 bg-gray-700 focus:outline-none focus:border-blue-400"
                   id="username" 
                   type="text" 
                   placeholder="Username" 
                   value={user.username} 
                   onChange={(e) => setUser({ ...user, username: e.target.value })} 
               />
               
               <input 
                   className="w-full p-2 border border-gray-600 rounded-lg mb-4 bg-gray-700 focus:outline-none focus:border-blue-400"
                   id="email" 
                   type="email" 
                   placeholder="Email" 
                   value={user.email} 
                   onChange={(e) => setUser({ ...user, email: e.target.value })} 
               />
               
               <input 
                   className="w-full p-2 border border-gray-600 rounded-lg mb-4 bg-gray-700 focus:outline-none focus:border-blue-400"
                   id="password" 
                   type="password" 
                   placeholder="Password" 
                   value={user.password} 
                   onChange={(e) => setUser({ ...user, password: e.target.value })} 
               />
               
               <button 
                   className="w-full p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                   onClick={onSignup}
               >
                   Signup
               </button>
               
               <div className="my-2 py-2">
                    <span>Already have an account? </span>
                     <Link className="text-blue-400 mt-4 hover:underline" href="/login">Login</Link>
                </div>
           </div>
       </div>
        </div>
        
    );
}
