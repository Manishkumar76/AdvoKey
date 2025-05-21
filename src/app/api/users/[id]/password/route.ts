import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Users from '@/models/userModel';
import bcrypt from 'bcryptjs';

export async function PUT(
  req: Request,
  context: any
) {
  try {
    await connect();

    const userId = context.params.id;
    const body = await req.json();
    const { currentPassword, password } = body;

    // Find user and get current hashed password
    const user = await Users.findById(userId).select('password');
    if (!user) {
      return NextResponse.json(
        { message: 'Users not found' },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Validation
    if (currentPassword === password) {
      return NextResponse.json(
        { message: 'New password cannot be the same as current password' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    if (password.length > 20) {
      return NextResponse.json(
        { message: 'Password must be less than 20 characters long' },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { message: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      );
    }
    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { message: 'Password must contain at least one lowercase letter' },
        { status: 400 }
      );
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { message: 'Password must contain at least one number' },
        { status: 400 }
      );
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return NextResponse.json(
        { message: 'Password must contain at least one special character' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.findByIdAndUpdate(userId, { password: hashedPassword });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
