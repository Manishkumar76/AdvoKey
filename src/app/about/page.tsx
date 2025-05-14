'use client';

import { Users, Briefcase, Calendar } from 'lucide-react';
import Image from 'next/image';
import AdvoKey_Logo from '@/app/assets/images/Advokey.png';

export default function AboutPage() {
    return (
        <div className="relative w-full min-h-screen bg-black text-white px-6 py-20">
            {/* Background Image */}
            <img
                src="/home_bg.png"
                alt="Law Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-10" />

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto flex flex-col gap-16">
                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-bold text-center text-white">About <span className="text-blue-400">AdvoKey</span></h1>

                {/* Top Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Info Card */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-md border border-gray-600 rounded-3xl p-8 shadow-lg transition hover:scale-[1.02]">
                        <h2 className="text-2xl font-semibold text-blue-300 mb-6">Website Information</h2>
                        <ul className="space-y-4 text-gray-300 text-lg">
                            <li><span className="font-semibold text-white">Name:</span> AdvoKey</li>
                            <li><span className="font-semibold text-white">Email:</span> contact@advokey.com</li>
                            <li><span className="font-semibold text-white">Address:</span> Bathinda Punjab, India</li>
                            <li><span className="font-semibold text-white">CEO:</span> Manish Kumar</li>
                        </ul>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-md border border-gray-600 rounded-3xl p-8 shadow-lg transition hover:scale-[1.02]">
                        <h2 className="text-2xl font-semibold text-blue-300 mb-6">Platform Statistics</h2>
                        <div className="grid sm:grid-cols-2 gap-6 text-gray-300">
                            <div className="flex items-center gap-4">
                                <Users className="w-6 h-6 text-blue-400" />
                                <span><strong className="text-white">85</strong> Lawyers</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Briefcase className="w-6 h-6 text-blue-400" />
                                <span><strong className="text-white">340</strong> Clients</span>
                            </div>
                            <div className="flex items-center gap-4 sm:col-span-2">
                                <Calendar className="w-6 h-6 text-blue-400" />
                                <span><strong className="text-white">570+</strong> Consultations Scheduled</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                
                    <div className="bg-white bg-opacity-10 backdrop-blur-md border border-gray-600 rounded-3xl p-8 shadow-lg text-center">
                        <h2 className="text-2xl font-semibold text-blue-300 mb-8">Meet the Developers</h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
                            {[
                                {
                                    name: 'Manish Kumar',
                                    img: '/user.jpg',
                                    qualification: 'B.Tech in CSE',
                                    description: "A highly motivated Full Stack Developer with a strong foundation in Flutter and backend engineering. Experienced in designing and developing scalable mobile and web applications using modern technologies and clean architectural principles. Adept at building robust APIs, integrating third-party services, and implementing secure authentication systems. Passionate about delivering seamless user experiences through performance-optimized code and responsive design. Proven ability to work collaboratively in agile environments, solve complex technical challenges, and maintain best practices in software engineering. Dedicated to continuous learning and staying updated with the latest advancements in the tech ecosystem.",
                                },
                                {
                                    name: 'Shubam ',
                                    img: '/user.jpg',
                                    qualification: 'B.Tech in CSE',
                                    description: 'A creative and detail-oriented Frontend Developer with a passion for building intuitive, responsive, and user-centric web interfaces. Skilled in modern frontend frameworks such as React.js and Next.js, and proficient in HTML5, CSS3, JavaScript, and Tailwind CSS. Experienced in translating design mockups into high-performance, accessible applications that work seamlessly across devices and browsers. Adept at using component-based architecture and state management for scalable frontend solutions. Committed to delivering visually engaging and functionally rich user experiences by following industry best practices, performance optimization techniques, and responsive design principles. Thrives in collaborative environments and agile teams..',
                                },
                               
                            ].map((dev, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white bg-opacity-5 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
                                >
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={dev.img}
                                            alt={dev.name}
                                            className="w-24 h-24 rounded-full border-2 border-blue-400 object-cover mb-4"
                                        />
                                        <h3 className="text-xl font-semibold text-white">{dev.name}</h3>
                                        <p className="text-blue-300 text-sm mb-1">{dev.qualification}</p>
                                        <p className="text-gray-300 text-sm text-center mt-2">{dev.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                </div>

                {/* Logo Section */}
                <div className="flex justify-center mt-10">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-400 shadow-lg">
                        <Image
                            src={AdvoKey_Logo}
                            alt="AdvoKey Logo"
                            className="h-full w-auto"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
