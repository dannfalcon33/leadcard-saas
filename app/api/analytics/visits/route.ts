import { NextRequest, NextResponse } from 'next/server';
import { getDailyVisits } from '@/utils/db-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const days = parseInt(searchParams.get('days') || '7', 10);

  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }

  try {
    const data = await getDailyVisits(projectId, days);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to get visits:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
