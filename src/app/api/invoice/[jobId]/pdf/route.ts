import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import type { DocumentProps } from '@react-pdf/renderer';
import { getJobByToken } from '@/lib/firestore';
import { InvoicePDF } from '@/lib/invoicePdf';

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
    return new NextResponse('Not found', { status: 404 });
  }

  if (!job.invoiceNumber) {
    return new NextResponse('No invoice generated for this job', { status: 400 });
  }

  try {
    const buffer = await renderToBuffer(createElement(InvoicePDF, { job }) as ReactElement<DocumentProps>);
    const fileName = `${job.invoiceNumber}-${job.clientName.replace(/\s+/g, '-')}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new NextResponse('PDF generation failed', { status: 500 });
  }
}
