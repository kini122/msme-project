import { NextRequest, NextResponse } from 'next/server';
import { SchemesApiClient } from '@/lib/schemes-api/client';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Scheme slug/ID is required.' },
        { status: 400 }
      );
    }

    const client = new SchemesApiClient();
    const scheme = await client.getSchemeBySlug(slug);

    if (!scheme) {
      return NextResponse.json(
        { success: false, error: `Scheme "${slug}" was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      scheme,
    });
  } catch (err: any) {
    console.error(`Error in /api/schemes/[slug]:`, err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to retrieve scheme detail',
      },
      { status: 500 }
    );
  }
}
