import { NextRequest, NextResponse } from 'next/server';
import { RapidApiCompanyProvider } from '@/lib/rapidapi/client';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required.' },
        { status: 400 }
      );
    }

    const provider = new RapidApiCompanyProvider();
    const company = await provider.lookupCompany(query.trim());

    return NextResponse.json({
      success: true,
      company,
    });
  } catch (error: any) {
    console.error('API Error in /api/company-lookup:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Enterprise verification could not be completed. Please verify the registration number and try again.',
      },
      { status: 500 }
    );
  }
}
