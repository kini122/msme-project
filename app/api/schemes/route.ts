import { NextRequest, NextResponse } from 'next/server';
import { SchemesApiClient } from '@/lib/schemes-api/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || undefined;
    const level = searchParams.get('level') || undefined;
    const state = searchParams.get('state') || undefined;
    const ministry = searchParams.get('ministry') || undefined;
    const category = searchParams.get('category') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

    const client = new SchemesApiClient();
    const result = await client.searchSchemes({
      q,
      level,
      state,
      ministry,
      category,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    console.error('Error in /api/schemes:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to search government schemes',
      },
      { status: 500 }
    );
  }
}
