'use client';

import { Users, Briefcase, Calendar } from 'lucide-react';
import Image from 'next/image';
import AdvoKey_Logo from '@/app/assets/images/Advokey.png';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="relative w-full min-h-screen bg-black text-white px-6 py-20 overflow-hidden">
            {/* Background Image */}
            <motion.img
                src="/home_bg.png"
                alt="Law Background"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-10" />

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto flex flex-col gap-16">
                {/* Title */}
                <motion.h1
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl lg:text-5xl font-bold text-center text-white"
                >
                    About <span className="text-blue-400">AdvoKey</span>
                </motion.h1>

                {/* Top Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-white bg-opacity-10 backdrop-blur-md border border-gray-600 rounded-3xl p-8 shadow-lg transition hover:scale-[1.02]"
                    >
                        <h2 className="text-2xl font-semibold text-blue-300 mb-6">Website Information</h2>
                        <ul className="space-y-4 text-gray-300 text-lg">
                            <li><span className="font-semibold text-white">Name:</span> AdvoKey</li>
                            <li><span className="font-semibold text-white">Email:</span> contact@advokey.com</li>
                            <li><span className="font-semibold text-white">Address:</span> Bathinda Punjab, India</li>
                            <li><span className="font-semibold text-white">CEO:</span> Manish Kumar</li>
                        </ul>
                    </motion.div>

                    {/* Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white bg-opacity-10 backdrop-blur-md border border-gray-600 rounded-3xl p-8 shadow-lg transition hover:scale-[1.02]"
                    >
                        <h2 className="text-2xl font-semibold text-blue-300 mb-6">Platform Statistics</h2>
                        <div className="grid sm:grid-cols-2 gap-6 text-gray-300">
                            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-4">
                                <Users className="w-6 h-6 text-blue-400" />
                                <span><strong className="text-white">85</strong> Lawyers</span>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-4">
                                <Briefcase className="w-6 h-6 text-blue-400" />
                                <span><strong className="text-white">340</strong> Clients</span>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-4 sm:col-span-2">
                                <Calendar className="w-6 h-6 text-blue-400" />
                                <span><strong className="text-white">570+</strong> Consultations Scheduled</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Team Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-white bg-opacity-10 backdrop-blur-md border border-gray-600 rounded-3xl p-8 shadow-lg text-center"
                >
                    <h2 className="text-2xl font-semibold text-blue-300 mb-8">Meet the Developers</h2>

                    <div className="grid w-full gap-6 justify-items-center">
                        {[
                            {
                                name: 'Manish Kumar',
                                img: '/user.jpg',
                                qualification: 'B.Tech in CSE',
                                description:
                                    "A highly motivated Full Stack Developer with a strong foundation in Flutter and backend engineering. Experienced in designing and developing scalable mobile and web applications using modern technologies and clean architectural principles. Adept at building robust APIs, integrating third-party services, and implementing secure authentication systems. Passionate about delivering seamless user experiences through performance-optimized code and responsive design. Proven ability to work collaboratively in agile environments, solve complex technical challenges, and maintain best practices in software engineering. Dedicated to continuous learning and staying updated with the latest advancements in the tech ecosystem.",
                            },
                        ].map((dev, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: idx * 0.2 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, rotate: 1 }}
                                className="bg-white bg-opacity-5 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-md hover:shadow-xl"
                            >
                                <div className="flex flex-col items-center w-full ">
                                    <img
                                        src={dev.img}
                                        alt={dev.name}
                                        className="w-24 h-24 rounded-full border-2 border-blue-400 object-cover mb-4"
                                    />
                                    <h3 className="text-xl font-semibold text-white">{dev.name}</h3>
                                    <p className="text-blue-300 text-sm mb-1">{dev.qualification}</p>
                                    <p className="text-gray-300 text-sm text-center mt-2">{dev.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex justify-center mt-10"
                >
                    <motion.div
                        whileHover={{ rotate: 6, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-400 shadow-lg"
                    >
                        <Image
                            src={AdvoKey_Logo}
                            alt="AdvoKey Logo"
                            className="h-full w-auto"
                            priority
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
