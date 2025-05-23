import { NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import Payments from '@/models/Payments';
import Users from '@/models/userModel';
import LawyerProfiles from '@/models/LawyerProfiles';

export async function GET() {
  try {
    await connect();

    const payments = await Payments.find()
      .sort({ timestamp: -1 }) // most recent first
      .populate('client_id')
      .populate({
        path: 'lawyer_id',
        populate: {
          path: 'user',
          model: 'Users',
        },
      });

    return NextResponse.json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err);
    return NextResponse.json({ message: 'Failed to fetch payments' }, { status: 500 });
  }
}

// POST request to create a new payment
export async function POST(request: Request) {
  try {
    await connect();

    const paymentData = await request.json();
    const { lawyer_id, client_id } = paymentData;

    // Check if the lawyer and client exist
    const lawyer = await LawyerProfiles.findById(lawyer_id);
    const client = await Users.findById(client_id);

    if (!lawyer || !client) {
      return NextResponse.json({ message: 'Lawyer or Client not found' }, { status: 404 });
    }

    const newPayment = new Payments(paymentData);
    await newPayment.save();

    return NextResponse.json(newPayment, { status: 201 });
  } catch (err) {
    console.error('Error creating payment:', err);
    return NextResponse.json({ message: 'Failed to create payment' }, { status: 500 });
  }
}
