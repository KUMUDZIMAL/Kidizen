import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(req: Request) {
  // Parse the incoming JSON body for credentials.
  const { username, password }: { username: string; password: string } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  // Ensure the database connection is established.
  await dbConnect();

  // Find the user by username.
  const user = await User.findOne({ username });

  if (!user) {
    console.log('here')
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Validate the provided password.
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    console.log('here 1')
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Create the JWT using jose, converting user._id to a string.
  const token = await new SignJWT({ 
    id: String(user._id),
    age: user.age // Include age in the JWT payload if needed for middleware
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(SECRET_KEY));

  // Prepare the response with the token set in an HTTP-only cookie
  // and include user age in the response for the frontend
  const response = NextResponse.json({ 
    message: 'Login successful',
    userAge: user.age // Include user age in the response
  }, { status: 200 });
  
  response.cookies.set('token', token, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 3600
  });

  return response;
}