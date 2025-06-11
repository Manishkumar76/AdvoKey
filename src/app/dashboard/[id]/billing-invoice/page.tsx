'use client';

import { useState } from 'react';

interface Invoice {
  id: string;
  clientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  details: string;
}

export default function LawyerBillingPage() {
  const invoices: Invoice[] = [
    {
      id: 'INV-1001',
      clientName: 'John Doe',
      date: '2025-05-15',
      amount: 250,
      status: 'Paid',
      details:
        'Consultation on contract law, 2 hours session. Includes documentation review.',
    },
    {
      id: 'INV-1002',
      clientName: 'Mary Smith',
      date: '2025-05-18',
      amount: 400,
      status: 'Unpaid',
      details:
        'Legal advice on property dispute, 3 hours session with follow-up email correspondence.',
    },
    {
      id: 'INV-1003',
      clientName: 'David Johnson',
      date: '2025-05-20',
      amount: 150,
      status: 'Overdue',
      details: 'Brief consultation, 1 hour session regarding employment contract.',
    },
  ];

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-950 to-black text-gray-100 p-8 flex flex-col gap-12 font-sans">
      <h1 className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-600 select-none drop-shadow-lg">
        🧾 Lawyer Billing & Invoices
      </h1>

      {/* Billing Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            title: 'Total Invoices',
            value: invoices.length,
            bg: 'from-indigo-700 to-indigo-600',
            icon: '📄',
          },
          {
            title: 'Total Paid',
            value: `$${invoices
              .filter((i) => i.status === 'Paid')
              .reduce((acc, cur) => acc + cur.amount, 0)}`,
            bg: 'from-green-700 to-green-600',
            icon: '✅',
          },
          {
            title: 'Total Due',
            value: `$${invoices
              .filter((i) => i.status !== 'Paid')
              .reduce((acc, cur) => acc + cur.amount, 0)}`,
            bg: 'from-red-700 to-red-600',
            icon: '⚠️',
          },
        ].map(({ title, value, bg, icon }) => (
          <div
            key={title}
            className={`relative bg-gradient-to-br ${bg} bg-opacity-30 backdrop-blur-md rounded-3xl shadow-md shadow-gray-700 p-6 flex flex-col items-center justify-center text-center cursor-default
            transition-transform duration-300 hover:scale-[1.05] hover:shadow-gray-600`}
            style={{ width: '220px', height: '120px' }}
          >
            <span className="text-5xl mb-1 animate-pulse">{icon}</span>
            <h2 className="text-lg font-semibold mb-1 tracking-wide">{title}</h2>
            <p className="text-3xl font-bold">{value}</p>
            <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none"></div>
          </div>
        ))}
      </section>

      {/* Invoice List & Details */}
      <section className="flex flex-col lg:flex-row gap-10">
        {/* Invoice List */}
        <div
          className="flex-1 max-h-[540px] overflow-y-auto bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20"
          role="list"
        >
          <h2 className="text-3xl font-semibold p-6 border-b border-white/20 select-none">
            Invoice List
          </h2>
          <ul>
            {invoices.map((inv) => {
              const selected = selectedInvoice?.id === inv.id;
              return (
                <li
                  key={inv.id}
                  role="listitem"
                  tabIndex={0}
                  onClick={() => setSelectedInvoice(inv)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setSelectedInvoice(inv);
                  }}
                  className={`flex justify-between items-center p-5 cursor-pointer transition-colors
                  ${
                    selected
                      ? 'bg-indigo-700 bg-opacity-40 shadow-lg'
                      : 'hover:bg-indigo-700 hover:bg-opacity-20'
                  } rounded-xl mx-6 my-3 select-none`}
                >
                  <div className="flex flex-col space-y-1">
                    <p className="text-lg font-semibold">{inv.clientName}</p>
                    <p className="text-sm text-gray-300 tracking-wider">{inv.id}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <p className="text-lg font-semibold">${inv.amount}</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${
                        inv.status === 'Paid'
                          ? 'bg-green-600 text-green-50'
                          : inv.status === 'Unpaid'
                          ? 'bg-blue-500 text-blue-50'
                          : 'bg-red-600 text-red-50'
                      } select-none`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Invoice Details */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 flex flex-col justify-between p-8">
          {selectedInvoice ? (
            <>
              <div>
                <h2 className="text-3xl font-semibold mb-6 border-b border-white/20 pb-3 select-none">
                  Invoice Details - {selectedInvoice.id}
                </h2>
                <div className="space-y-4">
                  <DetailRow label="Client" value={selectedInvoice.clientName} />
                  <DetailRow
                    label="Date"
                    value={new Date(selectedInvoice.date).toLocaleDateString()}
                  />
                  <DetailRow label="Amount" value={`$${selectedInvoice.amount}`} />
                  <div>
                    <span className="font-semibold">Status:</span>{' '}
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-sm font-semibold
                      ${
                        selectedInvoice.status === 'Paid'
                          ? 'bg-green-600 text-green-50'
                          : selectedInvoice.status === 'Unpaid'
                          ? 'bg-blue-500 text-blue-50'
                          : 'bg-red-600 text-red-50'
                      } select-none`}
                    >
                      {selectedInvoice.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Details:</h3>
                    <p className="text-gray-200 whitespace-pre-line leading-relaxed">
                      {selectedInvoice.details}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => alert('Download Invoice PDF feature coming soon!')}
                className="mt-10 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                  font-semibold text-lg transition-colors shadow-md select-none"
              >
                Download PDF
              </button>
            </>
          ) : (
            <p className="text-center text-gray-400 mt-40 select-none">
              Select an invoice to see details
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2 select-none">
      <span className="text-gray-300 font-medium">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
