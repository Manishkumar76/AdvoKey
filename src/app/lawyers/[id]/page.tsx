"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lawyer } from "@/helpers/interfaces/lawyer";
import Aos from "aos";
import axios from "axios";
import gsap from "gsap";
import "aos/dist/aos.css";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import toast, { Toaster } from "react-hot-toast";
import { Reviews } from "@/helpers/interfaces/review";

const LawyerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [owner, setOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const gsapRef = useRef(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [consultDate, setConsultDate] = useState("");
  const [consultTime, setConsultTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [notes, setNotes] = useState("");

  // Fetch lawyer data and reviews
  const fetchLawyerData = async () => {
    try {
      const [lawyerData, reviewData] = await Promise.all([
        axios.get(`/api/lawyers/${id}`),
        axios.get(`/api/reviews/lawyer/${id}`),
      ]);
      setLawyer(lawyerData?.data.data);
      setReviews(reviewData.data);
      if (!lawyerData.data) {
        throw new Error("Lawyer not found");
      }
    } catch (error: any) {
      setError("Failed to fetch lawyer data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logged-in user ID from token
  const fetchUserId = async () => {
    try {
      const id = (await getDataFromToken()).id;
      setUserId(id);
    } catch (err: any) {
      setError("Failed to fetch user ID");
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
    if (!loading) {
      gsap.from(gsapRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [loading]);

  // Handle review submission
  const handleSubmitReview = async () => {
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

  // Handle booking submission
  const handleBookConsultationSubmit = async () => {
    if (!consultDate || !consultTime || !durationMinutes) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("/api/consultation", {
        user_id: userId,
        lawyer_id: lawyer?._id,
        scheduledAt: consultDate,
        time: consultTime,
        durationMinutes,
        notes,
      });

      if (response.status !== 200) {
        toast.error("Failed to book consultation.");
        return;
      }

      toast.success("Consultation booked successfully!");
      setIsBookingModalOpen(false);
      setConsultDate("");
      setConsultTime("");
      setDurationMinutes(30);
      setNotes("");
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Failed to book consultation.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-4 pt-20 pb-10 animate-pulse">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 bg-gray-700 p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center bg-[#2C2C2C] rounded-xl p-6 w-full md:w-1/2">
            <div className="w-48 h-48 rounded-full bg-gray-700 mb-4" />
            <div className="h-6 bg-gray-700 rounded w-32 mb-2" />
            <div className="h-4 bg-gray-700 rounded w-24 mb-1" />
            <div className="h-4 bg-gray-700 rounded w-20 mb-1" />
            <div className="h-4 bg-gray-700 rounded w-28 mb-4" />
            <div className="h-10 w-36 bg-gray-700 rounded" />
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <div className="bg-[#2C2C2C] p-4 rounded-xl space-y-3">
              <div className="h-6 bg-gray-700 rounded w-40" />
              <div className="h-4 bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>

            <div className="bg-[#2C2C2C] p-4 rounded-xl space-y-4">
              <div className="h-6 bg-gray-700 rounded w-40" />
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-[#1A1A1A] p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-700 rounded" />
                      <div className="h-4 w-12 bg-gray-700 rounded" />
                    </div>
                    <div className="h-4 w-full bg-gray-700 rounded" />
                    <div className="h-3 w-1/2 bg-gray-700 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
    <div className="min-h-screen bg-gray-900 text-white px-4 pt-20 pb-10">
      <Toaster position="top-center" />
      <div
        className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg"
        ref={gsapRef}
      >
        {/* Left Panel: Lawyer Info */}
        <div className="flex flex-col items-center bg-gradient-to-br from-gray-800 via-black to-gray-800 rounded-xl p-6 w-full md:w-1/2">
          <img
            src={lawyer.user?.profile_image_url || "/lawyer_vector.jpeg"}
            alt={lawyer.user?.username}
            className="w-48 h-48 rounded-full object-cover border-4 border-gray-700 mb-4"
          />
          <h1 className="text-2xl font-bold mb-1">{lawyer.user?.username}</h1>
          <p className="text-gray-400">{lawyer.specialization_id?.name}</p>
          <p className="text-gray-400">{lawyer?.years_of_experience } years experience</p>
          
          {
            owner ? (
              <button
                onClick={() => router.push(`/dashboard/${userId}`)}
                className="mt-6 bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-md hover:bg-yellow-300 transition"
              >
                go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="mt-6 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-400 transition"
              >
                Book Consultation
              </button>
            )
          }
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
              { !owner && (
                <button
                className="text-sm bg-yellow-400 text-gray-900 px-4 py-1 rounded-md hover:bg-yellow-300 transition"
                onClick={() => setIsModalOpen(true)}
              >
                Add Review
              </button>)}
            </h2>

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
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
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
                  className={`cursor-pointer ${
                    star <= rating ? "text-yellow-400" : "text-gray-400"
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
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsBookingModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-gray-800 p-6 rounded-lg max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
              aria-label="Close booking modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-6 text-center">
              Book a Consultation
            </h2>

            <label className="block mb-2">
              Date:
              <input
                type="date"
                className="w-full p-2 rounded-md bg-gray-700 text-white"
                value={consultDate}
                onChange={(e) => setConsultDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} // No past dates
              />
            </label>

            <label className="block mb-2">
              Time:
              <input
                type="time"
                className="w-full p-2 rounded-md bg-gray-700 text-white"
                value={consultTime}
                onChange={(e) => setConsultTime(e.target.value)}
              />
            </label>

            <label className="block mb-2">
              Duration (minutes):
              <input
                type="number"
                min={15}
                max={180}
                step={15}
                className="w-full p-2 rounded-md bg-gray-700 text-white"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
              />
            </label>

            <label className="block mb-4">
              Notes (optional):
              <textarea
                rows={3}
                className="w-full p-2 rounded-md bg-gray-700 text-white resize-none"
                placeholder="Additional information..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

            <button
              onClick={handleBookConsultationSubmit}
              className="w-full bg-yellow-400 text-gray-900 font-semibold py-2 rounded-md hover:bg-yellow-300 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerDetail;
