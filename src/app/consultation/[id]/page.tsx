// File: src/app/consultation/[id]/page.tsx

import axios from 'axios';
import { notFound } from 'next/navigation';

interface Params {
  params: {
    id: string;
  };
}

export default async function ConsultationPage({ params }: Params) {
  const res = await axios.get(`/api/consultations/${params.id}`);

  if (!res) {
    notFound(); // or show an error page
  }

  const consultation = await res.data;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Consultation Details</h1>
      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <p><strong>Client:</strong> {consultation.client_id?.username || 'N/A'}</p>
        <p><strong>Lawyer:</strong> {consultation.lawyer_id?.fullName || 'N/A'}</p>
        <p><strong>Status:</strong> {consultation.status}</p>
        <p><strong>Notes:</strong> {consultation.notes || 'No notes'}</p>
        <p><strong>Start Time:</strong> {new Date(consultation.timeslot_id?.start_time).toLocaleString()}</p>
        <p><strong>End Time:</strong> {new Date(consultation.timeslot_id?.end_time).toLocaleString()}</p>
        <p><strong>Created At:</strong> {new Date(consultation.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
}
