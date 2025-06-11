'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import { Consultations } from '@/helpers/interfaces/consultation';

export default function Payment( params: { consultationId: string } ) {
 
  const consultationId = params?.consultationId as string
  const router = useRouter()
  const [consultation, setConsultation] = useState<Consultations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    const fetchConsultation = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/consultation/${consultationId}`)
        if (!res.ok) throw new Error('Failed to load consultation data')
        const data = await res.json()
        setConsultation(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (consultationId) fetchConsultation()
  }, [consultationId])

  const handlePayment = useCallback(async () => {
    if (!consultation) return
    setError(null)
    setIsPaying(true)
    setPaymentSuccess(false)

    try {
      const paymentRes = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultationId, amount: consultation.fee }),
      })

      if (!paymentRes.ok) {
        const errData = await paymentRes.json()
        throw new Error(errData.error || 'Payment failed')
      }

      const chatRes = await fetch('/api/chat-session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultationId }),
      })

      if (!chatRes.ok) {
        const errData = await chatRes.json()
        throw new Error(errData.error || 'Failed to start chat session')
      }

      setPaymentSuccess(true)

      setTimeout(() => {
        router.push(`/dashboard/chat/${consultationId}`)
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsPaying(false)
    }
  }, [consultation, consultationId, router])


  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading consultation details...</p>
      </div>
    )
  }

  // Show error if consultation not found
  if (error && !consultation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  // ✅ Show payment success message
  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-green-600 text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-700">Payment Successful!</h2>
          <p className="text-gray-600 mt-2">
            Your payment has been processed successfully. Redirecting to chat session...
          </p>
          <p className="mt-6 text-sm text-gray-400">If you are not redirected, click the button below:</p>
          <button
            className="mt-4 rounded-md bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700"
            onClick={() => router.push(`/dashboard/chat/${consultationId}`)}
          >
            Go to Chat
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pt-20">
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        {/* Left Side - Summary */}
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">You are about to pay for a consultation.</p>

          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            <div className="flex flex-col rounded-lg bg-white sm:flex-row">
              <div className="m-2 h-24 w-28 rounded-md border bg-gray-200 flex items-center justify-center text-center font-bold text-gray-600">
                📞
              </div>
              <div className="flex w-full flex-col px-4 py-4">
                <span className="font-semibold">{consultation?.client_id.username}</span>
                <span className="float-right text-gray-400">{consultation?.notes}</span>
                <p className="text-lg font-bold">${consultation?.fee}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-4">
              {consultation?.lawyer_id.user.profile_image_url ? (
                <img
                  src={consultation.lawyer_id?.user.profile_image_url}
                  alt={consultation.lawyer_id?.user.username}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700">
                  {consultation?.lawyer_id.user.username[0]}
                </div>
              )}
              <div>
                <p className="font-semibold">{consultation?.lawyer_id.user.username}</p>
                <p className="text-gray-500 text-sm">{consultation?.lawyer_id?.specialization_id?.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Payment */}
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Payment Details</p>
          <p className="text-gray-400">Proceed to start your chat session after payment.</p>
          <div className="mt-6 flex items-center justify-between border-t border-b py-2">
            <p className="text-sm font-medium text-gray-900">Consultation Fee</p>
            <p className="font-semibold text-gray-900">${consultation?.fee}</p>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">Total</p>
            <p className="text-2xl font-semibold text-gray-900">${consultation?.fee}</p>
          </div>

          {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}

          <button
            onClick={handlePayment}
            disabled={isPaying}
            className="mt-6 w-full rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isPaying ? 'Processing...' : 'Pay & Start Chat'}
          </button>
        </div>
      </div>
    </div>
  )
}
