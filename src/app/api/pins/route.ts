import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pins = await db`
      SELECT id, title, description, image_url, affiliate_url, category, price, tags
      FROM public.pins
      WHERE published = true
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ pins });
  } catch {
    return NextResponse.json({ error: 'Could not load picks.' }, { status: 500 });
  }
}
