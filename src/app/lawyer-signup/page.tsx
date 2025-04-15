'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Lottie from 'lottie-react';
import bg_image from '../assets/images/web_bg.jpg';
import loadingAnimation from '../assets/animation/loading.json';

const initialFormData = {
  username: '',
  email: '',
  password: '',
  licenseNumber: '',
  ratePerHour: '',
  specialization: '',
  bio: '',
};

export default function LawyerRegister() {
  const router = useRouter();

  const [form, setForm] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const validate = () => {
    const newErrors: any = {};

    if (!form.username) newErrors.username = 'Username is required';
    if (!form.specialization) newErrors.specialization = 'Specialization is required';
    if (!form.bio) newErrors.bio = 'Bio is required';
    if (!form.licenseNumber) newErrors.licenseNumber = 'License number is required';
    if (!form.ratePerHour || isNaN(Number(form.ratePerHour))) newErrors.ratePerHour = 'Valid rate per hour is required';

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else {
      let passErrors = '';
      if (form.password.length < 8) passErrors += 'At least 8 chars. ';
      if (!/[A-Z]/.test(form.password)) passErrors += '1 uppercase. ';
      if (!/[a-z]/.test(form.password)) passErrors += '1 lowercase. ';
      if (!/\d/.test(form.password)) passErrors += '1 number. ';
      if (!/[@$!%*?&]/.test(form.password)) passErrors += '1 special char. ';
      if (passErrors) newErrors.password = passErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setButtonDisabled(!validate());
  }, [form]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/lawyers', {
        role: 'lawyer',
        ...form,
      });
      toast.success('Registration successful!');
      router.push('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
      setButtonDisabled(true);
    }
  };

  useEffect(() => {
    const mousemove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', mousemove);
    return () => window.removeEventListener('mousemove', mousemove);
  }, []);

  useGSAP(() => {
    gsap.to('.cursor', {
      x: mousePosition.x,
      y: mousePosition.y,
      ease: 'power2.out',
      duration: 0.3,
    });
  }, [mousePosition]);

  const inputField = (name: string, label?: string, type: string = 'text') => (
    <div className="w-full mb-4">
      <input
        className="w-full p-2 border border-gray-600 rounded-lg text-black focus:outline-none focus:border-blue-400"
        type={type}
        placeholder={label || name.charAt(0).toUpperCase() + name.slice(1)}
        value={(form as any)[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        onBlur={() => handleBlur(name)}
      />
      {touched[name] && errors[name] && (
        <div className="text-red-500 text-sm mt-1">{errors[name]}</div>
      )}
    </div>
  );

  return (
    <div className="relative">
      <Toaster position="top-right" />
      <div className="cursor w-6 h-6 rounded-full bg-white fixed z-50 pointer-events-none"></div>

      <div className="h-screen bg-gray-900 flex items-center justify-center relative">
        <img src={bg_image.src} alt="Background" className="h-screen absolute w-full object-cover" />
        {loading && (
          <div className="absolute bg-black bg-opacity-50 h-screen w-full z-50 flex items-center justify-center">
            <Lottie animationData={loadingAnimation} className="w-1/2" />
          </div>
        )}
        <div className="flex flex-col items-center w-96 p-6 rounded-lg bg-gray-600 text-white bg-opacity-30 backdrop-blur">
          <h1 className="text-xl font-bold mb-4">Lawyer Signup</h1>

          {inputField('username')}
          {inputField('email', 'Email', 'email')}
          {inputField('password', 'Password', 'password')}
          {inputField('licenseNumber', 'License Number')}
          {inputField('ratePerHour', 'Rate Per Hour', 'number')}
          {inputField('specialization')}
          <div className="w-full mb-4">
            <textarea
              className="w-full p-2 border border-gray-600 rounded-lg text-black focus:outline-none focus:border-blue-400"
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              onBlur={() => handleBlur('bio')}
              rows={3}
            />
            {touched.bio && errors.bio && (
              <div className="text-red-500 text-sm mt-1">{errors.bio}</div>
            )}
          </div>

          <button
            disabled={buttonDisabled}
            className="w-full p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
            onClick={handleRegister}
          >
            Register
          </button>

          <div className="my-2 py-2">
            <span>Already have an account? </span>
            <a className="text-blue-400 mt-4 hover:underline" href="/login">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
