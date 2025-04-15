'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function LandingPageSections() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-black text-white">
      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20" data-aos="fade-up">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[{ icon: '🔍', title: 'Search a Lawyer' }, { icon: '📅', title: 'Book a Consultation' }, { icon: '📞', title: 'Talk to Your Lawyer' }, { icon: '💳', title: 'Pay Securely' }].map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-xl shadow-lg bg-gray-600 bg-opacity-30 backdrop-blur-md hover:shadow-2xl transition"
              data-aos="zoom-in"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="font-semibold text-lg text-white">{step.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Lawyers */}
      <section className="py-20 px-4 sm:px-6" data-aos="fade-up">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Featured Lawyers</h2>
          <Link href="/lawyers" className="text-blue-400 hover:underline font-medium">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-gray-600 bg-opacity-30 backdrop-blur-md p-6 rounded-xl text-center shadow-md" data-aos="zoom-in">
              <img
                src={`https://randomuser.me/api/portraits/men/${idx + 30}.jpg`}
                alt="Lawyer"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white"
              />
              <h3 className="font-bold text-xl text-white">John Doe</h3>
              <p className="text-sm text-gray-300">Criminal Law Specialist</p>
              <div className="text-yellow-400 mt-2 mb-4">★★★★★</div>
              <Link
                href="/book"
                className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded-lg font-semibold text-white inline-block"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 bg-black" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-gray-600 bg-opacity-30 backdrop-blur-md p-6 rounded-xl text-white" data-aos="fade-up" data-aos-delay={`${idx * 100}`}>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://randomuser.me/api/portraits/women/${idx + 10}.jpg`}
                    alt="Reviewer"
                    className="w-12 h-12 rounded-full border border-white"
                  />
                  <div>
                    <h4 className="font-semibold">Jane Smith</h4>
                    <p className="text-sm text-gray-300">Hired: John Doe</p>
                  </div>
                </div>
                <p className="italic text-gray-200">“Amazing service! Got connected with a brilliant lawyer in minutes.”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 bg-black" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-white">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[{ question: 'How much does it cost?', answer: 'Pricing depends on the lawyer and the consultation time. Many offer free first calls.' }, { question: 'How do I book a lawyer?', answer: 'Just search, click “Book Now”, and select your preferred time slot.' }, { question: 'Is my information private?', answer: 'Yes. All communications are secure and confidential.' }].map((faq, idx) => (
              <details
                key={idx}
                className="p-4 rounded-lg shadow-md bg-gray-600 bg-opacity-30 backdrop-blur-md text-white cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={`${idx * 100}`}
              >
                <summary className="font-semibold text-lg">{faq.question}</summary>
                <p className="mt-2 text-gray-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 px-4 sm:px-6 text-center" data-aos="zoom-in">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Get Legal Help?</h2>
        <p className="text-lg mb-8">Find the right lawyer or become one of our trusted legal experts.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/lawyers"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Find a Lawyer Now
          </Link>
          <Link
            href="/join"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Join as a Lawyer
          </Link>
        </div>
      </section>
    </div>
  );
}