import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const DEALERSHIP_ID = 'c0e0a112-83d3-4a83-81f4-5ac11b3b87c7';

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// Strip HTML tags to get plain text for storage
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Normalize phone to E.164-ish for matching (strip non-digits, keep +)
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Resend inbound webhook shape: { type: 'email.received', data: { from, to, subject, text, html } }
    const data = body.data ?? body;
    const fromRaw: string = data.from ?? '';
    const subject: string = data.subject ?? '(no subject)';
    const text: string    = data.text ?? (data.html ? stripHtml(data.html) : '');

    // Extract email address from "Name <email@>" format
    const fromMatch = fromRaw.match(/<([^>]+)>/) ?? fromRaw.match(/(\S+@\S+)/);
    const fromEmail = (fromMatch?.[1] ?? fromRaw).toLowerCase().trim();

    if (!fromEmail || !text) {
      return NextResponse.json({ ok: false, reason: 'missing from or body' }, { status: 400 });
    }

    const supabase = db();

    // Look up the lead by email
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('dealership_id', DEALERSHIP_ID)
      .ilike('email', fromEmail)
      .maybeSingle();

    if (!lead) {
      // Not a known lead — ignore silently
      return NextResponse.json({ ok: true, skipped: 'unknown sender' });
    }

    await supabase.from('lead_messages').insert({
      lead_id:       lead.id,
      dealership_id: DEALERSHIP_ID,
      direction:     'inbound',
      channel:       'email',
      subject,
      body:          text,
      from_address:  fromEmail,
      to_address:    'leads@trgtmrkt.com',
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[email-reply webhook]', err.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
