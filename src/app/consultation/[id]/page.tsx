"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import {Consultation} from '@/helpers/interfaces/consultation';

const statusColorMap: Record<string, string> = {
  pending: "bg-yellow-500 animate-pulse",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

const SkeletonCard = () => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md animate-pulse flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div className="flex items-center gap-4 w-full">
      <div className="w-10 h-10 bg-gray-700 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-1/3" />
        <div className="h-3 bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-700 rounded w-1/4" />
      </div>
    </div>
    <div className="h-4 bg-gray-700 rounded w-24 mt-3 md:mt-0" />
  </div>
);

const ConsultationsWithLawyer = () => {
  const { id: lawyerId } = useParams<{ id: string }>();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const uid = await getDataFromToken();
        setUserId(uid?.id);

        const res = await axios.get(`/api/consultation`);
        const all: Consultation[] = res.data?.userConsultations || [];

        if (!Array.isArray(all)) throw new Error("Invalid data format");

        const filtered = all.filter((c) => c.lawyer_id._id === lawyerId);
        setConsultations(filtered);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load consultations");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [lawyerId]);

  const filteredConsultations = consultations.filter((c) => {
    const name = c.lawyer_id.user?.username?.toLowerCase() || "";
    const notes = c.notes?.toLowerCase() || "";
    return name.includes(search.toLowerCase()) || notes.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 pt-24 pb-12">
      <h1 className="text-2xl font-bold mb-6">Consultations with this Lawyer</h1>

      <input
        type="text"
        placeholder="Search by lawyer name or notes..."
        className="w-full mb-6 p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredConsultations.length === 0 ? (
        <p className="text-gray-400">No consultations found.</p>
      ) : (
        <div className="space-y-6">
          {filteredConsultations.map((c) => (
            <div
              key={c._id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-3">
                {c.lawyer_id.user?.profile_image_url && (
                  <img
                    src={c.lawyer_id.user.profile_image_url}
                    alt="Lawyer"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{c.lawyer_id.user?.username}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(c.scheduledAt).toLocaleDateString()} at {c.time}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-300">Duration: {c.durationMinutes} mins</p>
              {c.notes && (
                <p className="text-sm text-gray-400 mt-1">Notes: {c.notes}</p>
              )}
              <div className="mt-3">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                    statusColorMap[c.status.toLowerCase()] || "bg-blue-500"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationsWithLawyer;
