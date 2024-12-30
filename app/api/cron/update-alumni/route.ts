import { NextResponse } from 'next/server';
import { checkAndUpdateAlumniStatus } from '@/lib/supabase';

export async function GET() {
  try {
    await checkAndUpdateAlumniStatus();
    return NextResponse.json({ success: true, message: 'Alumni status updated successfully' });
  } catch (error) {
    console.error('Error updating alumni status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update alumni status' },
      { status: 500 }
    );
  }
}
