'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Lottie from "lottie-react";
import loadingAnimation from '@/app/assets/animation/page_loading.json';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import lawyer_vector from '@/app/assets/images/lawyer_vector.jpeg';
import { Lawyer } from '@/helpers/interfaces/lawyer';



export default function LawyerProfile() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const gsapRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchLawyerData();
  }, []);

  const fetchLawyerData = async () => {
    try {
      const response = await axios.get(`/api/lawyers/${id}`);
      setLawyer(response.data.data);
    } catch (error: any) {
      console.error('Error:', error);
      setError('Failed to fetch lawyer data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookConsultation = () => {
    if (id) {
      router.push(`/consultation/${id}`);
    }
  };

  useGSAP(() => {
    if (!loading) {
      gsap.from(gsapRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out',
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Lottie animationData={loadingAnimation} loop />
      </div>
    );
  }

  if (error || !lawyer) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-red-500 text-lg">{error || 'Lawyer not found'}</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6 mt-20">
      <div className="max-w-4xl mx-auto" ref={gsapRef}>
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center mb-8">
          <img
            src={lawyer.user.profile_image_url || lawyer_vector.toString()}
            alt={`${lawyer.user.username}'s profile`}
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg"
          />
          <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-3xl font-bold">{lawyer.user.username}</h1>
            {lawyer.isverify && (
              <span className="text-green-500 font-semibold">✅ Verified Lawyer</span>
            )}
            <p className="mt-2 text-gray-400">{lawyer.specialization}</p>
          </div>
        </div>

        {/* About Me Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">About Me</h2>
          <p>{lawyer.bio}</p>
        </div>

        {/* Contact & Experience */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <p>📧 Email: {lawyer.user.email}</p>
          <p>📱 Phone: {lawyer.user.phone}</p>
          <p>📍 Location: {lawyer.location?.city}, {lawyer.location?.state}, {lawyer.location?.country}</p>
          <p>⏳ Experience: {lawyer.years_of_experience} years</p>
          <p>⭐ Rating: {lawyer.rating}</p>
          <p>📅 Availability: {lawyer.availability}</p>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBookConsultation}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300"
        >
          Book a Consultation
        </button>
      </div>
    </div>
  );
}
