// app/payment/[consultationId]/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentPage({ params }:any) {
  const { consultationId } = params
  const router = useRouter()

  const handlePayment = async () => {
    // Dummy payment logic
    await fetch('/api/payment', {
      method: 'POST',
      body: JSON.stringify({ consultationId, amount: 20 }),
    })

    // Activate chat session
    await fetch(`/api/chat-session/start`, {
      method: 'POST',
      body: JSON.stringify({ consultationId }),
    })

    router.push(`/chat/${consultationId}`)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Payments</h2>
      <p>Total: $20</p>
      <button onClick={handlePayment} className="bg-blue-600 text-white px-6 py-2 mt-4 rounded">Pay & Start Chat</button>
    </div>
  )
}
