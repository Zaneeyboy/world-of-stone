import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import type { DocumentProps } from '@react-pdf/renderer';
import { getJobByToken } from '@/lib/firestore';
import { QuotePDF } from '@/lib/quotePdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ jobId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { jobId } = await params;
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse('Missing token', { status: 401 });
  }

  let job;
  try {
    job = await getJobByToken(jobId, token);
  } catch {
    return new NextResponse('Server error', { status: 500 });
  }

  if (!job) {
    return new NextResponse('Quote not found', { status: 404 });
  }

  try {
    const buffer = await renderToBuffer(createElement(QuotePDF, { job }) as ReactElement<DocumentProps>);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${job.jobNumber}.pdf"`,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('PDF render error:', err);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
