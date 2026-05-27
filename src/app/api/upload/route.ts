import { NextRequest, NextResponse } from 'next/server';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export async function POST(_req: NextRequest) {
  if (!ACCOUNT_ID || !API_TOKEN) {
    return NextResponse.json({ error: 'Cloudflare credentials not configured' }, { status: 500 });
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v2/direct_upload`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
    // Empty body — Cloudflare generates a one-time upload URL
    body: new FormData(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Cloudflare direct_upload error:', text);
    return NextResponse.json({ error: 'Failed to get upload URL from Cloudflare' }, { status: 502 });
  }

  const json = (await res.json()) as { result: { id: string; uploadURL: string }; success: boolean };

  if (!json.success) {
    return NextResponse.json({ error: 'Cloudflare returned unsuccessful response' }, { status: 502 });
  }

  return NextResponse.json({ uploadURL: json.result.uploadURL, id: json.result.id });
}
