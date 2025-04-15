// app/dashboard/page.tsx or wherever your dashboard lives
async function getConsultations() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/consultations/index`, {
      cache: 'no-store',
    });
  
    if (!res.ok) {
      throw new Error('Failed to fetch consultations');
    }
  
    return res.json();
  }
  
  export default async function DashboardPage() {
    const consultations = await getConsultations();
  
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🗓️ My Consultations</h1>
  
        {consultations.length === 0 ? (
          <p className="text-gray-500">You have no consultations yet.</p>
        ) : (
          <ul className="space-y-4">
            {consultations.map((c: any) => (
              <li key={c._id} className="border p-4 rounded-lg shadow-sm">
                <p><strong>👨‍⚖️ Lawyer:</strong> {c.lawyer?.user?.fullName || 'Unknown'}</p>
                <p><strong>📅 Scheduled At:</strong> {new Date(c.scheduledAt).toLocaleString()}</p>
                <p><strong>📝 Notes:</strong> {c.notes || 'None'}</p>
                <p><strong>⏱ Duration:</strong> {c.durationMinutes} minutes</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  