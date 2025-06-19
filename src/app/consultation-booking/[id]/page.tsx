'use client';

import React, { useEffect, useState, useCallback, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Lawyers } from '@/helpers/interfaces/lawyer';
import { toast } from 'react-hot-toast';
import { getDataFromToken } from '@/helpers/getDataFromToken';

export default function ConsultationBookingPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [consultDate, setConsultDate] = useState('');
    const [consultTime, setConsultTime] = useState('');
    const [durationMinutes, setDurationMinutes] = useState(30);
    const [notes, setNotes] = useState('');
    const [isBookingLoading, setIsBookingLoading] = useState(false);
    const [lawyer, setLawyer] = useState<Lawyers | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [isPaying, setIsPaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMode, setPaymentMode] = useState<'debit' | 'credit' | 'upi' | 'paypal'>('debit');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [consultationId, setConsultationId] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return; // wait until id is available
        console.log("Router param ID:", id);
        const fetchLawyer = async () => {
            setLoading(true);
            
            try {
                const res = await axios.get(`/api/lawyers/${id}`);
                if (res.data) {
                    setLawyer(res?.data.data);
                }
            } catch (err) {
                toast.error('Failed to fetch lawyer details.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchLawyer();
    }, [id]);
    

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const res = await (await getDataFromToken()).id;
                setUserId(res);
            } catch (error) {
                toast.error('Unable to get user data');
            }
        };
        fetchUserId();
    }, []);
    

    const handleBookConsultationSubmit = async () => {
        if (!consultDate || !consultTime || !durationMinutes) {
            toast.error('Please fill in all required fields.');
            return;
        }
        try {
            setIsBookingLoading(true);
            const response = await axios.post('/api/consultation', {
                client_id: userId,
                lawyer_id: lawyer?._id,
                scheduledAt: consultDate,
                time: consultTime,
                durationMinutes,
                notes,
            });
            setConsultationId(response.data._id);
            if (response.status !== 200) throw new Error('Booking failed');
            toast.success('Consultation booked successfully!');
            setShowBookingModal(true);
        } catch (err) {
            console.error(err);
            toast.error('Booking failed.');
        } finally {
            setIsBookingLoading(false);
        }
    };

    const handleCancelBooking = () => {
        setConsultDate(new Date().toISOString().split('T')[0]);
        setConsultTime('09:00');
        setDurationMinutes(30);
        setNotes('');
        setConsultationId(null);
        toast('Booking reset.');
    };

    const handlePayment = useCallback(async () => {
        setIsPaying(true);
        setError(null);
        try {
            await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ consultationId, amount: totalAmount }),
            });
            await fetch('/api/chat-session/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ consultationId }),
            });
            setShowSuccessModal(true);
            setTimeout(() => router.push(`/dashboard/${userId}/chat`), 2000);
        } catch (err: any) {
            setError('Payment or chat session failed');
        } finally {
            setIsPaying(false);
        }
    }, [consultationId, router, totalAmount]);

    useEffect(() => {
        if (lawyer) {
            const pricePerMinute = lawyer?.Consultation_price!;
            setTotalAmount(pricePerMinute * durationMinutes);
        }
    }, [lawyer, durationMinutes]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <svg
                    className="animate-spin h-12 w-12 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                    />
                </svg>
            </div>
        );
    }

    if (!lawyer) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <p>Lawyer not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white py-10 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg p-6 shadow-md">
                <div className="mb-6 bg-gray-800 rounded-lg p-4 shadow-md space-y-4">
                    {/* Avatar & Name */}
                    <div className="flex items-center space-x-4">
                        <img
                            src={`${lawyer?.user?.profile_image_url}`}
                            alt="Profile"
                            className="h-16 w-16 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-lg font-semibold text-white">👤 {lawyer?.user?.username}</p>
                            <p className="text-sm text-gray-400">{lawyer?.isVerified?"Verified":"Pending Verification"}</p>
                        </div>
                    </div>

                    {/* Specialization */}
                    <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">🎓 Specialization</span>
                        <span className="text-white font-medium">
                            {lawyer?.specialization_id && typeof lawyer.specialization_id === 'object'
                                ? lawyer.specialization_id.name
                                : 'N/A'}
                        </span>
                    </div>

                    {/* Price per Minute */}
                    <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">💰 Price per Minute</span>
                        <span className="text-white font-medium">₹{lawyer?.Consultation_price}</span>
                    </div>

                    {/* Experience (optional placeholder) */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">📅 Experience</span>
                        <span className="text-white font-medium">{lawyer?.years_of_experience}</span> {/* Replace if dynamic */}
                    </div>
                </div>


                <div className="grid gap-4">
                    <label className="block">
                        Date:
                        <input
                            type="date"
                            className="w-full p-2 mt-1 rounded bg-gray-800 text-white"
                            value={consultDate}
                            onChange={(e) => setConsultDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            disabled={isBookingLoading}
                        />
                    </label>

                    <label className="block">
                        Time:
                        <input
                            type="time"
                            className="w-full p-2 mt-1 rounded bg-gray-800 text-white"
                            value={consultTime}
                            onChange={(e) => setConsultTime(e.target.value)}
                            disabled={isBookingLoading}
                        />
                    </label>

                    <label className="block">
                        Duration (minutes):
                        <input
                            type="number"
                            min={15}
                            max={180}
                            step={15}
                            className="w-full p-2 mt-1 rounded bg-gray-800 text-white"
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                            disabled={isBookingLoading}
                        />
                    </label>

                    <label className="block">
                        Notes:
                        <textarea
                            className="w-full p-2 mt-1 rounded bg-gray-800 text-white resize-none"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={isBookingLoading}
                        />
                    </label>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleBookConsultationSubmit}
                            className={`flex-1 bg-blue-400 text-black font-semibold py-2 rounded-md hover:bg-blue-300 transition flex items-center justify-center gap-2 ${isBookingLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isBookingLoading}
                        >
                            {isBookingLoading && (
                                <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}
                            {isBookingLoading ? 'Booking...' : 'Book Now'}
                        </button>

                        <button
                            onClick={handleCancelBooking}
                            className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-500 transition"
                            disabled={isBookingLoading || isPaying}
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-700 pt-6">
                    <h3 className="text-xl font-semibold mb-2">Summary</h3>
                    <ul className="text-gray-300 text-sm mb-4 space-y-1">
                        <li><span className="font-medium">Date:</span> {consultDate}</li>
                        <li><span className="font-medium">Time:</span> {consultTime}</li>
                        <li><span className="font-medium">Duration:</span> {durationMinutes} mins</li>
                        <li><span className="font-medium">Total Fee:</span> ₹{totalAmount.toFixed(2)}</li>
                    </ul>

                    <div className="flex flex-wrap gap-4 mb-4">
                        <button onClick={() => setPaymentMode('debit')} className={`flex-1 p-4 rounded-lg ${paymentMode === 'debit' ? 'bg-blue-600' : 'bg-gray-700'}`}>💳 Debit Card</button>
                        <button onClick={() => setPaymentMode('credit')} className={`flex-1 p-4 rounded-lg ${paymentMode === 'credit' ? 'bg-green-600' : 'bg-gray-700'}`}>💳 Credit Card</button>
                        <button onClick={() => setPaymentMode('upi')} className={`flex-1 p-4 rounded-lg ${paymentMode === 'upi' ? 'bg-blue-600' : 'bg-gray-700'}`}>🪙 UPI</button>
                        <button onClick={() => setPaymentMode('paypal')} className={`flex-1 p-4 rounded-lg ${paymentMode === 'paypal' ? 'bg-blue-500 text-black' : 'bg-gray-700'}`}>🧾 PayPal</button>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    <button
                        onClick={handlePayment}
                        className={`w-full bg-blue-400 text-black font-semibold py-2 rounded-md hover:bg-blue-300 transition ${isPaying || !consultationId ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isPaying || !consultationId}
                    >
                        {isPaying ? 'Processing...' : 'Pay & Start Chat'}
                    </button>
                </div>
            </div>

            {/* Payment Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full text-center shadow-xl">
                        <h2 className="text-2xl font-bold mb-2 text-green-400">🎉 Payment Successful!</h2>
                        <p className="text-gray-300 mb-4">Redirecting to chat session...</p>
                        <div className="w-full h-2 bg-green-400 animate-pulse rounded-full"></div>
                    </div>
                </div>
            )}

            {/* Booking Success Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full text-center shadow-xl">
                        <h2 className="text-2xl font-bold mb-2 text-blue-400">📅 Booking Confirmed!</h2>
                        <p className="text-gray-300 mb-4">Your consultation has been scheduled.</p>
                        <button
                            onClick={() => setShowBookingModal(false)}
                            className="mt-4 bg-blue-500 text-black font-semibold px-4 py-2 rounded hover:bg-blue-400"
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
