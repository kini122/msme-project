import { NextRequest, NextResponse } from 'next/server';
import { DataGovClient } from '@/lib/datagov/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { district, sector, classification, state = 'Kerala', limit = 10, offset = 0 } = body;

    const dataGov = new DataGovClient();
    const result = await dataGov.fetchUdyamCompanies({
      state,
      district,
      sector,
      classification,
      limit: Number(limit) || 10,
      offset: Number(offset) || 0,
    });

    return NextResponse.json({
      success: true,
      companies: result.companies,
      total: result.total,
      source: result.source,
    });
  } catch (error: any) {
    console.error('Error in /api/companies/live-fetch:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch enterprise records' },
      { status: 500 }
    );
  }
}
