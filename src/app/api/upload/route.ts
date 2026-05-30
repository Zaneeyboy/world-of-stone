import { NextRequest, NextResponse } from 'next/server';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export async function POST(_req: NextRequest) {
  if (!ACCOUNT_ID || !API_TOKEN) {
    return NextResponse.json({ error: 'Cloudflare credentials not configured' }, { status: 500 });
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v2/direct_upload`;

  const body = new FormData();
  body.append('metadata', JSON.stringify({ folder: 'world-of-stone/products' }));

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body,
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

export async function DELETE(req: NextRequest) {
  if (!ACCOUNT_ID || !API_TOKEN) {
    return NextResponse.json({ error: 'Cloudflare credentials not configured' }, { status: 500 });
  }

  const imageId = req.nextUrl.searchParams.get('id');

  // Validate ID format to prevent injection — CF image IDs are alphanumeric + hyphen
  if (!imageId || !/^[a-zA-Z0-9_-]+$/.test(imageId)) {
    return NextResponse.json({ error: 'Invalid or missing image id' }, { status: 400 });
  }

  const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1/${imageId}`;
  const res = await fetch(cfUrl, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Cloudflare image delete error:', text);
    return NextResponse.json({ error: 'Failed to delete image from Cloudflare' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
