import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Comment } from '@/models/Comment';

export async function GET() {
  try {
    await connectDB();
    const comments = await Comment.find().sort({ timestamp: -1 });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const comment = await Comment.create(body);
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
