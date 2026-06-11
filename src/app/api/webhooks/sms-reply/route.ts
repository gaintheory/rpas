import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const DEALERSHIP_ID = 'c0e0a112-83d3-4a83-81f4-5ac11b3b87c7';

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function normalizePhone(raw: string): string[] {
  const digits = raw.replace(/\D/g, '');
  const candidates: string[] = [raw.trim()];
  if (digits.length === 10)  candidates.push(`+1${digits}`, digits);
  if (digits.length === 11)  candidates.push(`+${digits}`, digits.slice(1), `+1${digits.slice(1)}`);
  return [...new Set(candidates)];
}

export async function POST(req: NextRequest) {
  try {
    // Twilio posts form-encoded
    const text = await req.text();
    const params = new URLSearchParams(text);

    const from = params.get('From') ?? '';
    const body = params.get('Body') ?? '';
    const to   = params.get('To')   ?? '';

    if (!from || !body) {
      return new NextResponse('', { status: 400 });
    }

    const supabase = db();
    const candidates = normalizePhone(from);

    // Try each phone format to find the lead
    let lead: { id: string } | null = null;
    for (const candidate of candidates) {
      const { data } = await supabase
        .from('leads')
        .select('id')
        .eq('dealership_id', DEALERSHIP_ID)
        .eq('phone', candidate)
        .maybeSingle();
      if (data) { lead = data; break; }
    }

    if (lead) {
      await supabase.from('lead_messages').insert({
        lead_id:       lead.id,
        dealership_id: DEALERSHIP_ID,
        direction:     'inbound',
        channel:       'sms',
        body,
        from_address:  from,
        to_address:    to,
      });
    }

    // Twilio expects TwiML response (even empty)
    return new NextResponse('<?xml version="1.0"?><Response></Response>', {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (err: any) {
    console.error('[sms-reply webhook]', err.message);
    return new NextResponse('<?xml version="1.0"?><Response></Response>', {
      headers: { 'Content-Type': 'text/xml' },
    });
  }
}
