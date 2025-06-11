'use client';

import { useState, useMemo } from 'react';

interface Document {
  id: string;
  title: string;
  client: string;
  date: string;
  type: 'Contract' | 'Agreement' | 'Pleading' | 'Invoice' | 'Other';
  description: string;
  fileUrl?: string;
}

const documentsData: Document[] = [
  {
    id: 'DOC-001',
    title: 'Employment Contract - John Doe',
    client: 'John Doe',
    date: '2025-04-12',
    type: 'Contract',
    description: 'Full-time employment contract with salary and benefits details.',
    fileUrl: '#',
  },
  {
    id: 'DOC-002',
    title: 'Property Sale Agreement - Mary Smith',
    client: 'Mary Smith',
    date: '2025-05-01',
    type: 'Agreement',
    description:
      'Legal agreement for property sale between client and third party.',
    fileUrl: '#',
  },
  {
    id: 'DOC-003',
    title: 'Pleading - Johnson vs Acme Corp',
    client: 'David Johnson',
    date: '2025-05-10',
    type: 'Pleading',
    description: 'Court pleading for case no. 4578, regarding breach of contract.',
    fileUrl: '#',
  },
  {
    id: 'DOC-004',
    title: 'Invoice - Case Consultation',
    client: 'Anna Brown',
    date: '2025-05-20',
    type: 'Invoice',
    description: 'Invoice for consultation services on civil rights case.',
    fileUrl: '#',
  },
  {
    id: 'DOC-005',
    title: 'Non-Disclosure Agreement (NDA)',
    client: 'Global Tech Inc',
    date: '2025-03-22',
    type: 'Agreement',
    description: 'Mutual NDA for confidential information exchange.',
    fileUrl: '#',
  },
];

export default function LawyerDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered documents based on search term (title or client)
  const filteredDocuments = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return documentsData.filter(
      (doc) =>
        doc.title.toLowerCase().includes(term) ||
        doc.client.toLowerCase().includes(term) ||
        doc.type.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Document type counts
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const doc of documentsData) {
      counts[doc.type] = (counts[doc.type] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-950 to-black text-gray-100 p-8 font-sans flex flex-col gap-10">
      <h1 className="text-5xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-600 select-none drop-shadow-lg">
        📁 Lawyer Documents
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar summary */}
        <aside
          className="w-full lg:w-72 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 p-6 flex flex-col gap-6"
          aria-label="Document summary"
        >
          <h2 className="text-3xl font-semibold select-none">Summary</h2>
          <div className="text-lg">
            <p>
              <span className="font-bold">{documentsData.length}</span>{' '}
              documents total
            </p>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">By Type:</h3>
              <ul className="space-y-2">
                {Object.entries(typeCounts).map(([type, count]) => (
                  <li
                    key={type}
                    className="flex justify-between border-b border-white/20 pb-1 select-none"
                  >
                    <span>{type}</span>
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Search input */}
          <div className="relative w-full max-w-md">
            <input
              type="search"
              placeholder="Search documents by title, client or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-gray-100 placeholder-gray-400 py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              aria-label="Search documents"
            />
            <span
              aria-hidden="true"
              className="absolute right-4 top-3.5 text-gray-400 select-none"
            >
              🔍
            </span>
          </div>

          {/* Documents list */}
          <section
            className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-auto max-h-[620px] pr-2"
            aria-label="Documents list"
          >
            {filteredDocuments.length === 0 ? (
              <p className="text-gray-400 select-none">No documents found.</p>
            ) : (
              filteredDocuments.map((doc) => (
                <article
                  key={doc.id}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-md border border-white/20
                    hover:scale-[1.03] hover:shadow-indigo-700 transition-transform cursor-pointer select-none"
                  tabIndex={0}
                  role="button"
                  onClick={() =>
                    alert(`Opening document: ${doc.title} (Feature coming soon)`)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      alert(`Opening document: ${doc.title} (Feature coming soon)`);
                    }
                  }}
                >
                  <h3 className="text-2xl font-semibold mb-2">{doc.title}</h3>
                  <p className="text-sm text-gray-300 mb-2">{doc.description}</p>
                  <div className="flex justify-between text-gray-400 text-sm font-mono">
                    <span>Client: {doc.client}</span>
                    <span>{new Date(doc.date).toLocaleDateString()}</span>
                  </div>
                  <span
                    className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold
                    ${
                      doc.type === 'Contract'
                        ? 'bg-indigo-600 text-indigo-50'
                        : doc.type === 'Agreement'
                        ? 'bg-blue-600 text-blue-50'
                        : doc.type === 'Pleading'
                        ? 'bg-red-600 text-red-50'
                        : doc.type === 'Invoice'
                        ? 'bg-green-600 text-green-50'
                        : 'bg-gray-600 text-gray-200'
                    } select-none`}
                  >
                    {doc.type}
                  </span>
                </article>
              ))
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
