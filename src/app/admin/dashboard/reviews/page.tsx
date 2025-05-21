'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Reviews } from '@/helpers/interfaces/review';
import CountUp from 'react-countup';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell
} from 'recharts';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Reviews[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
    const barColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']; 
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get('/api/reviews');
                setReviews(res.data);
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const handleDelete = async () => {
        if (!selectedReviewId) return;
        try {
            await axios.delete(`/api/reviews/${selectedReviewId}`);
            setReviews((prev) => prev.filter((review) => review._id !== selectedReviewId));
        } catch (err) {
            console.error('Failed to delete review:', err);
        } finally {
            setShowDeleteModal(false);
            setSelectedReviewId(null);
        }
    };
    const recentReviewsCount = reviews.filter((review) => {
        const createdDate = new Date(review.created_at);
        const today = new Date();
        const daysDiff = (today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= 7;
    }).length;

    // Group reviews by rating (1 to 5)
    const ratingStats = [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        count: reviews.filter((r) => r.rating === rating).length,
    }));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Reviews Management</h1>

            {/* Top Summary Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* Total Reviews Box */}
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Total Reviews</h2>
                    <h3 className="text-lg font-medium text-gray-700">
                        <CountUp end={reviews.length} duration={1.5} />
                    </h3>
                </div>

                {/* Recent Reviews Box */}
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Reviews</h2>
                    <h3 className="text-lg font-medium text-gray-700">
                        <CountUp end={recentReviewsCount} duration={1.5} />
                    </h3>
                    <p className="text-sm text-gray-500">In the last 7 days</p>
                </div>
            </div>


            {/* Rating Chart */}
            <div className="bg-white shadow rounded-lg p-4 mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Reviews by Rating</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ratingStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count">
                            {ratingStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>


            {loading ? (
                <div className="flex items-center justify-center h-screen bg-gray-100">
                    <div className="animate-spin h-10 w-10 border-4 border-gray-400 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Lawyer</th>
                                    <th className="px-6 py-3">Rating</th>
                                    <th className="px-6 py-3">Comment</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{review.client_id?.username || 'Unknown'}</td>
                                        <td className="px-6 py-4">
                                            {review.lawyer_id?.user && typeof review.lawyer_id.user !== 'string'
                                                ? review.lawyer_id.user.username
                                                : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">{review.rating} ⭐</td>
                                        <td className="px-6 py-4">{review.comment}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedReviewId(review._id);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="bg-white rounded-lg p-6 text-black w-full max-w-sm">
                        <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
                        <p className="mb-6">This will permanently delete the review.</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedReviewId(null);
                                }}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
