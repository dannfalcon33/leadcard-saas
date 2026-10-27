import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/utils/db-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, ownerId, data } = body;

    if (!projectId || !ownerId || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lead = await createLead(projectId, ownerId, data);
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json({ error: 'Failed to record lead' }, { status: 500 });
  }
}
