"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lawyer } from "@/helpers/interfaces/lawyer";
import { useGSAP } from "@gsap/react";
import Lottie from "lottie-react";
import Aos from "aos";
import axios from "axios";
import gsap from "gsap";
import loadingAnimation from "@/app/assets/animation/page_loading.json";
import "aos/dist/aos.css";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import toast, { Toaster } from "react-hot-toast";

interface Review {
  _id: string;
  comment: string;
  rating: number;
  created_at: string;
  lawyer_id: {
    _id: string;
    username: string;
  };
  client_id: {
    _id: string;
    username: string;
  };
}

const LawyerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [owner, setOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const gsapRef = useRef(null);

  useEffect(() => {
    Aos.init({ duration: 1000 });
    fetchLawyerData();
    fetchReviews();
    fetchUserId();
  }, []);

  useEffect(() => {
    if (lawyer && userId && lawyer.user?._id === userId) {
      setOwner(true);
    }
  }, [lawyer, userId]);

  const fetchLawyerData = async () => {
    try {
      const { data } = await axios.get(`/api/lawyers/${id}`);
      setLawyer(data.data);
    } catch (err: any) {
      setError("Failed to fetch lawyer data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserId = async () => {
    try {
      const id = await getDataFromToken();
      setUserId(id);
    } catch (err: any) {
      setError("Failed to fetch user ID");
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/api/reviews");
      const lawyerReviews = res.data.filter((r: Review) => r.lawyer_id._id === id);
      setReviews(lawyerReviews);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const { data } = await axios.post("/api/reviews", {
        client_id: userId,
        lawyer_id: id,
        rating,
        comment,
      });
      setReviews((prev) => [data, ...prev]);
      setIsModalOpen(false);
      setComment("");
      setRating(5);
      toast.success("Review submitted successfully!");
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error("Failed to submit review.");
      setIsModalOpen(false);
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
        ease: "power2.out",
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
        <p className="text-red-500 text-lg">{error || "Lawyer not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 flex justify-center pt-20">
      <Toaster position="top-right" />
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 bg-[#1E1E1E] rounded-lg shadow-xl p-6" ref={gsapRef}>
        <div className="flex flex-col items-center">
          <img
            src={lawyer.user?.profile_image_url || "/default-avatar.png"}
            alt={lawyer.user?.username}
            className="w-64 h-64 rounded-lg object-cover border-2 border-gray-600 mb-4"
          />
          <h1 className="text-2xl font-bold text-center">{lawyer.user?.fullname}</h1>
          <p className="text-sm text-gray-400">{lawyer.specialization}</p>
          <p className="text-sm text-gray-500">{lawyer.years_of_experience} years experience</p>
          <div className="text-yellow-400 font-medium mt-2">
            ⭐ {typeof lawyer.rating === "number" ? lawyer.rating.toFixed(1) : "N/A"} / 5
          </div>
          {owner ? (
            <button
              className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white"
              onClick={() => router.push(`/dashboard/${userId}`)}
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              onClick={handleBookConsultation}
            >
              Book Consultation
            </button>
          )}
        </div>

        <div>
          <p className="mb-6 text-gray-300">{lawyer.bio}</p>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Client Reviews</h2>
            {userId && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add Review
              </button>
            )}
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-400 italic">No reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review._id} className="bg-[#2C2C2C] p-4 rounded">
                  <h3 className="text-lg font-semibold">{review.client_id.username}</h3>
                  <p>{review.comment}</p>
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>⭐ {review.rating}</span>
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-200 text-black rounded-lg w-full max-w-md p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex items-center mb-4 space-x-1 text-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-600"}`}
                >
                  ★
                </span>
              ))}
            </div>

            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-700 bg-white text-black rounded p-2 mb-4"
              placeholder="Write your feedback..."
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerDetail;
