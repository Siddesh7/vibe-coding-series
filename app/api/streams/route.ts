import { NextResponse } from 'next/server';
import { getStreamsFromSheet } from '@/lib/sheets';

export async function GET() {
  try {
    const streams = await getStreamsFromSheet();
    return NextResponse.json(streams);
  } catch (error) {
    console.error('Error fetching streams:', error);
    return NextResponse.json({ error: 'Failed to fetch streams' }, { status: 500 });
  }
}
