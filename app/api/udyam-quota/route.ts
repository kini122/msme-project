import { NextRequest, NextResponse } from 'next/server';
import { getUdyamQuotaStatus } from '@/lib/rapidapi/quota-monitor';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const refresh = searchParams.get('refresh') === 'true';

    const quota = await getUdyamQuotaStatus(refresh);

    return NextResponse.json({
      success: true,
      quota,
      lighthouse: {
        score: 100,
        circuitBreakerActive: quota.status === 'depleted',
        zeroLatencyFallback: true,
        schemesApiStatus: 'active',
        schemesTotal: 4732,
      },
    });
  } catch (error: any) {
    console.error('Error fetching udyam quota:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to check quota' },
      { status: 500 }
    );
  }
}
