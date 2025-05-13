'use client';

import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import LandingPageSections from './components/core/landingPageSections';
import Image from 'next/image';
import AdvoKey_Logo from '@/app/assets/images/Advokey.png';
export default function HomePage() {
  return (
    <>
      <Toaster position="top-right" />

      {/* Hero Section */}
      <div className="relative w-full flex items-center justify-center py-20 px-6 bg-black">
        {/* Background Image */}
        <img
          src="/home_bg.png"
          alt="Law Background"
          className="absolute inset-0 h-full w-full object-cover z-0"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-10" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 bg-gray-600 bg-opacity-30 backdrop-blur-md text-white p-10 rounded-2xl shadow-lg">
          {/* Text Section */}
          <div className="max-w-xl text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              Find Legal Help <br /> <span className="text-blue-400">Instantly</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Whether you’re facing a personal or business challenge, AdvoKey connects you with trusted legal professionals at the click of a button.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                href="/get-legal-advice"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-base rounded-lg"
              >
                Get Legal Advice
              </Link>
              <Link
                href="/lawyers"
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 transition text-gray-800 font-semibold text-base rounded-lg"
              >
                Browse Lawyers
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:block w-72 h-72 rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg">
            <Image
              src={AdvoKey_Logo}
              alt="AdvoKey Logo"
              className="h-full w-auto "
              priority
            />
          </div>
        </div>
      </div>
      <LandingPageSections />
    </>
  );
}
