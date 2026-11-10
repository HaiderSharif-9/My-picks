import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';

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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });
    const body = await request.json();
    const { title, description, image_url, affiliate_url, category, price } = body;
    if (typeof title !== 'string' || !title.trim() || !validUrl(image_url) || !validUrl(affiliate_url)) {
      return NextResponse.json({ error: 'Enter a title and valid HTTPS image and affiliate URLs.' }, { status: 400 });
    }
    const rows = await db`
      UPDATE public.pins SET title = ${title.trim()}, description = ${description || null},
        image_url = ${image_url}, affiliate_url = ${affiliate_url},
        category = ${category || 'Everyday'}, price = ${price || null}, updated_at = now()
      WHERE id = ${params.id} RETURNING *
    `;
    if (!rows.length) return NextResponse.json({ error: 'Pick not found.' }, { status: 404 });
    return NextResponse.json({ pin: rows[0] });
  } catch {
    return NextResponse.json({ error: 'Could not update this pick.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });
    await db`DELETE FROM public.pins WHERE id = ${params.id}`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not delete this pick.' }, { status: 500 });
  }
}
