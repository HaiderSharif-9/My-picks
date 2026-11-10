import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    await db`
      UPDATE public.pins
      SET click_count = click_count + 1
      WHERE id = ${params.id} AND published = true
    `;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Click could not be recorded.' }, { status: 500 });
  }
}
