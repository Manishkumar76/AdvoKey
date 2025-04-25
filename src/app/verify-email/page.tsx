'use client';

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link, Loader2 } from "lucide-react";
import axios from "axios";

export default function VerifyEmailPage() {

    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [verified, setVerified] = useState(false);
    const router = useRouter();

    const verifyUserEmail = async () => {
        try {
            setLoading(true);
            const res = await axios.post("/api/users/verify-email", { token })

            setLoading(false);
            if (res.data.success) {
                setVerified(true);
            } else {
                setError(res.data.message);
            }
        }
        catch (err: any) {
            setLoading(false);
            setError(err.response.data.message);
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []); // Empty dependency array to run only once on mount

    useEffect(() => {
        if (token.length > 0 && token !== undefined) {
            verifyUserEmail();
        }

    }, [token]);

 return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <h2 className="p-2 bg-blue-900 text-white">{token? `${token}`: "no token"}</h2>
        {
            verified && (
                <div className="bg-green-500 text-white p-4 rounded">
                    <h2>Email verified successfully!</h2>
                    <p>You can now login to your account.</p>
                    <Link href="/login" className="text-blue-500 underline mt-4">Login</Link>
                </div>

            )}{
            error &&(
              <div>
                <h2 className="text-red-500">{error}</h2>
                <p>Please try again later.</p>
              </div>
            )
        }
    </div>
 )
}
