import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function isAdmin() {
  const { data } = await auth.getSession();
  const userId = data?.user?.id;
  if (!userId) return false;
  const rows = await db`SELECT user_id FROM public.admin_users WHERE user_id = ${userId} LIMIT 1`;
  return rows.length > 0;
}

function validUrl(value: unknown) {
  if (typeof value !== 'string') return false;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}

export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });
    const pins = await db`SELECT * FROM public.pins ORDER BY created_at DESC`;
    return NextResponse.json({ pins });
  } catch {
    return NextResponse.json({ error: 'Could not load admin data.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });
    const body = await request.json();
    const { title, description, image_url, affiliate_url, category, price } = body;
    if (typeof title !== 'string' || !title.trim() || !validUrl(image_url) || !validUrl(affiliate_url)) {
      return NextResponse.json({ error: 'Enter a title and valid HTTPS image and affiliate URLs.' }, { status: 400 });
    }
    const rows = await db`
      INSERT INTO public.pins (title, description, image_url, affiliate_url, category, price, published)
      VALUES (${title.trim()}, ${description || null}, ${image_url}, ${affiliate_url}, ${category || 'Everyday'}, ${price || null}, true)
      RETURNING *
    `;
    return NextResponse.json({ pin: rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not save this pick.' }, { status: 500 });
  }
}
