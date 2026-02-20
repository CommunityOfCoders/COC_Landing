import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import resources from '@/data/resources.json';

// Removed edge runtime for OpenNext Cloudflare compatibility
// export const runtime = 'edge';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain } = await params;
    const domainResources = resources[domain as keyof typeof resources] || [];

    return NextResponse.json(domainResources);
  } catch {
    return NextResponse.json(
      { error: "Failed to load domain resources" },
      { status: 500 }
    );
  }
}