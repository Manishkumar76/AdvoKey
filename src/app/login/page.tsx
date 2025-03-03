'use client'; // This file is client-side only
import Link from "next/link";
import React from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Login() {
    const [user, setUser] = React.useState({
        email: "",
        password: ""
    });

    const onLogin = async () => {
        try {
            const response = await axios.post("/api/login", user);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    // GSAP Cursor Effect
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    useGSAP(() => {
        const mousemove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', mousemove);
        
        gsap.to('.cursor', {
            x: mousePosition.x,
            y: mousePosition.y,
        });
    }, [mousePosition]);

    return (
        <div className="h-screen">
            <div className="cursor w-6 h-6 rounded-full bg-white fixed z-50"></div>
            <div className="h-screen bg-gray-900 flex items-center justify-center relative">
                <div className="flex flex-col items-center w-96 p-6 rounded-lg shadow-lg bg-gray-800 text-white shadow-blue-500 ">
                    <h1 className='text-xl font-bold mb-4'>Login Page</h1>
                    <input className="w-full p-2 border border-gray-600 rounded-lg mb-4 bg-gray-700 focus:outline-none focus:border-blue-400" id="email" type="text" placeholder="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                    <input className="w-full p-2 border border-gray-600 rounded-lg mb-4 bg-gray-700 focus:outline-none focus:border-blue-400" id="password" type="password" placeholder="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                    <button className="w-full p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200" onClick={onLogin}>Login</button>
                   <div className="my-2 py-2">
                    <span>Don't have an account? </span>
                     <Link className="text-blue-400 mt-4 hover:underline" href="/signup">Sign Up</Link>
                </div>
                </div>
            </div>
        </div>
    );
}
