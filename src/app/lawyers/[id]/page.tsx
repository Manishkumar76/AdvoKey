"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lawyers } from "@/helpers/interfaces/lawyer";
import Aos from "aos";
import axios from "axios";
import gsap from "gsap";
import "aos/dist/aos.css";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import toast, { Toaster } from "react-hot-toast";
import { Reviews } from "@/helpers/interfaces/review";
import Link from "next/link";

const LawyerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<Lawyers | null>(null);
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [owner, setOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const gsapRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);


  // Fetch lawyer data and reviews
  const fetchLawyerData = async () => {
    try {
      const [lawyerData, reviewData] = await Promise.all([
        axios.get(`/api/lawyers/${id}`),
        axios.get(`/api/reviews/lawyer/${id}`),
      ]);
      setLawyer(lawyerData?.data.data);
      setReviews(reviewData.data.reviews || []);

      if (!lawyerData.data) {
        throw new Error("Lawyers not found");
      }
    } catch (error: any) {
      setError("Failed to fetch lawyer data");
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  // Fetch logged-in user ID from token
  const fetchUserId = async () => {
    try {
      const id = (await getDataFromToken()).id;
      setUserId(id);
    } catch (err: any) {
      toast.error("Failed to fetch user ID. Please log in again.");
      router.replace("/login");

      console.error(err);
    }
  };

  useEffect(() => {
    Aos.init({ duration: 1000 });
    fetchLawyerData();
    fetchUserId();
  }, []);

  // Check if logged-in user is the owner of the lawyer profile
  useEffect(() => {
    if (lawyer && userId && lawyer.user?._id === userId) {
      setOwner(true);
    }
  }, [lawyer, userId]);

  // GSAP animation on load
  useEffect(() => {
    if (!pageLoading) {
      gsap.from(gsapRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [pageLoading]);

  useEffect(() => {
    console.log("👨‍⚖️ Lawyer fetched:", lawyer);
    console.log("🆔 Lawyer ID:", lawyer?._id);
  }, [lawyer]);
  

  // Handle review submission
  const handleSubmitReview = async () => {
    setLoading(true);
    try {
      if (!userId) {
        toast.error("You must be logged in to submit a review.");
        return;
      }
      if (comment.trim() === "") {
        toast.error("Comment cannot be empty.");
        return;
      }
      if (rating < 1 || rating > 5) {
        toast.error("Rating must be between 1 and 5.");
        return;
      }

      const { data } = await axios.post("/api/reviews", {
        client_id: userId,
        lawyer_id: id,
        rating,
        comment,
      });
      setIsModalOpen(false);

      setReviews((prev) => [data, ...prev]);

      setComment("");
      setRating(5);

      toast.success("Review submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit review.");
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle booking submission


  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <svg className="animate-spin h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>

    );
  }

  if (error || !lawyer) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-red-500 text-lg">{error || "Lawyers not found"}</p>
      </div>
    );
  }

  // Circular pageLoading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center mt-4">
      <svg
        className="animate-spin h-8 w-8 text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 pt-20 pb-10">
      <Toaster position="top-center" />
      <div
        className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg"
        ref={gsapRef}
      >
        {/* Left Panel: Lawyers Info */}
        <div className="flex flex-col items-center bg-gradient-to-br from-gray-800 via-black to-gray-800 rounded-xl p-6 w-full md:w-1/2">
          <img
            src={lawyer.user?.profile_image_url || "/lawyer_vector.jpeg"}
            alt={lawyer.user?.username}
            className="w-48 h-48 rounded-full object-cover border-4 border-gray-700 mb-4"
          />
          <h1 className="text-2xl font-bold mb-1">{lawyer.user?.username}</h1>
          <p className="text-gray-400">{lawyer.specialization_id?.name}</p>
          <p className="text-gray-400">{lawyer?.years_of_experience} years experience</p>

          {owner ? (
            <button
              onClick={() => router.push(`/dashboard/${userId}`)}
              className="mt-6 bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-md hover:bg-yellow-300 transition"
            >
              Go to Dashboard
            </button>
          ) : 
            lawyer?._id && (
              <Link href={`/consultation-booking/${lawyer._id}`}>
                <button className="mt-6 bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-400 transition">
                  Book Consultation
                </button>
              </Link>
            


          )}
        </div>

        {/* Right Panel: Reviews */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-gray-800 via-black to-gray-800 p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-gray-300">{lawyer?.bio || "No description available."}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 via-black to-gray-800 p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
              Reviews
              {!owner && (
                <button
                  className="text-sm bg-yellow-400 text-gray-900 px-4 py-1 rounded-md hover:bg-yellow-300 transition"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Review
                </button>

              )}

            </h2>
            <h1 className="text-2xl font-semibold mb-4 flex justify-between items-center">
              {reviews.length > 0 && (
                <div>
                  <span className="text-gray-500 text-sm">
                    Average Rating:{" "}
                  </span><span className="text-yellow-300 text-sm">
                    {(
                      reviews.reduce((acc, review) => acc + review.rating, 0) /
                      reviews.length
                    ).toFixed(1)}
                  </span>
                </div>
              )}
            </h1>

            {reviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet.</p>
            ) : (
              <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-[#2C2C2C] p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{review.client_id.username}</h3>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`${star <= review.rating ? "text-yellow-400" : "text-white"} `}>
                            {star <= review.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Review Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-gray-800 p-6 rounded-lg max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
              aria-label="Close review modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Submit Your Review</h2>

            <div className="flex items-center mb-4 space-x-1 text-2xl justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${star <= rating ? "text-yellow-400" : "text-white"
                    }`}
                  role="button"
                  aria-label={`${star} star`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setRating(star);
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              rows={4}
              placeholder="Write your review here..."
              className="w-full p-3 rounded-md bg-gray-700 text-white resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              onClick={handleSubmitReview}
              className="mt-4 w-full bg-yellow-400 text-gray-900 font-semibold py-2 rounded-md hover:bg-yellow-300 transition"
            >
              Submit Review

              {loading && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                  role="dialog"
                  aria-modal="true"
                >
                  <svg className="animate-spin h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default LawyerDetail;
