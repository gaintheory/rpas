import { createClient } from '@supabase/supabase-js';

const DEALERSHIP_ID = 'c0e0a112-83d3-4a83-81f4-5ac11b3b87c7';

const SOURCE_LABELS: Record<string, string> = {
  contact_form: 'Contact Form',
  stephen_cta:  'Stephen CTA',
  hero_form:    'Hero Form',
  sell_form:    'Sell Form',
  credit_app:   'Credit Application',
};

export type NotifyPayload = {
  leadType: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  message?: string | null;
  vehicleOfInterest?: string | null;
  vin?: string | null;
  printUrl?: string | null;
};

type VehicleInfo = {
  year: number | null;
  make: string | null;
  model: string | null;
  price: number | null;
  mileage: number | null;
  stock_number: string | null;
  photo_urls: string[] | null;
  vin: string | null;
};

function formatName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] || 'Lead';
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() ?? '';
  return `${parts[0]} ${lastInitial}.`;
}

async function lookupVehicle(vin: string): Promise<VehicleInfo | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabase
      .from('inventory')
      .select('year, make, model, price, mileage, stock_number, photo_urls, vin')
      .eq('vin', vin)
      .eq('dealership_id', DEALERSHIP_ID)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

function buildEmailHtml(
  payload: NotifyPayload,
  vehicle: VehicleInfo | null,
  formattedName: string
): string {
  const sourceLabel = SOURCE_LABELS[payload.leadType] ?? payload.leadType;
  const isCreditApp = payload.leadType === 'credit_app';
  const year = new Date().getFullYear();

  const emailSubject = isCreditApp
    ? `${formattedName} Submitted A New Loan Application`
    : vehicle
      ? `${formattedName} Is Interested In Your ${vehicle.year} ${vehicle.make} ${vehicle.model}`
      : `${formattedName} — New ${sourceLabel}`;

  const vehicleCard = vehicle ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; margin-top:20px; border-collapse:collapse;">
      <tr>
        ${vehicle.photo_urls?.length
          ? `<td width="160" style="vertical-align:top;"><img src="${vehicle.photo_urls[0]}" width="160" height="110" style="display:block; object-fit:cover;" /></td>`
          : `<td width="160" style="background:#f3f4f6; height:110px; vertical-align:middle; text-align:center; color:#9ca3af; font-size:12px;">No Photo</td>`
        }
        <td style="padding:12px 16px; vertical-align:top;">
          <a href="https://rpas-ruddy.vercel.app/" style="color:#C49A3C; font-weight:700; font-size:15px; text-decoration:none; display:block; margin-bottom:8px;">
            ${vehicle.year ?? ''} ${vehicle.make ?? ''} ${vehicle.model ?? ''}
          </a>
          <table cellpadding="0" cellspacing="0" style="font-size:12px; color:#6b7280;">
            <tr><td style="padding:2px 8px 2px 0;"><strong style="color:#374151;">Status:</strong></td><td>Active</td></tr>
            ${vehicle.price ? `<tr><td style="padding:2px 8px 2px 0;"><strong style="color:#374151;">Price:</strong></td><td>$${vehicle.price.toLocaleString()}</td></tr>` : ''}
            ${vehicle.mileage ? `<tr><td style="padding:2px 8px 2px 0;"><strong style="color:#374151;">Mileage:</strong></td><td>${vehicle.mileage.toLocaleString()}</td></tr>` : ''}
            ${vehicle.stock_number ? `<tr><td style="padding:2px 8px 2px 0;"><strong style="color:#374151;">Stock #:</strong></td><td>${vehicle.stock_number}</td></tr>` : ''}
            ${vehicle.vin ? `<tr><td style="padding:2px 8px 2px 0;"><strong style="color:#374151;">VIN:</strong></td><td style="font-family:monospace; font-size:11px;">${vehicle.vin}</td></tr>` : ''}
          </table>
        </td>
      </tr>
    </table>
  ` : '';

  const printBtn = payload.printUrl ? `
    <div style="margin:20px 0; text-align:center;">
      <a href="${payload.printUrl}"
         style="background:#0C0D0F; color:#C49A3C; padding:13px 32px; text-decoration:none;
                font-weight:700; font-size:13px; display:inline-block; border:2px solid #C49A3C;
                letter-spacing:0.06em; font-family:Arial,sans-serif;">
        VIEW &amp; PRINT APPLICATION →
      </a>
    </div>
    <p style="font-size:11px; color:#9ca3af; text-align:center; margin-top:4px;">
      Full application data is encrypted in this link. No SSN or financial data is stored in the database.
    </p>
  ` : '';

  const messageBlock = payload.message ? `
    <div style="margin-top:12px; padding:12px; background:#f9fafb; border-left:3px solid #C49A3C;">
      <p style="margin:0; font-size:13px; color:#374151; font-style:italic;">"${payload.message}"</p>
    </div>
  ` : '';

  const voiBlock = payload.vehicleOfInterest && payload.vehicleOfInterest !== 'N/A' ? `
    <tr><td style="padding:4px 0; color:#6b7280; width:130px;">Vehicle Interest</td><td style="font-weight:600;">${payload.vehicleOfInterest}</td></tr>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:-apple-system,Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;box-shadow:0 2px 16px rgba(0,0,0,0.12);">

  <!-- Header -->
  <tr><td style="background:#0C0D0F;padding:18px 24px;">
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td style="vertical-align:middle;padding-right:18px;">
          <div style="font-size:28px;font-weight:900;letter-spacing:0.08em;line-height:1;white-space:nowrap;">
            <span style="color:#8B8FA8;">T</span><span style="color:#EDEFF4;">M</span><span style="color:#C49A3C;">C</span>
          </div>
        </td>
        <td style="vertical-align:middle;">
          <p style="margin:0 0 2px;font-size:9px;text-transform:uppercase;letter-spacing:0.16em;color:#4E5266;">Target Market Center</p>
          <p style="margin:0;font-size:17px;font-weight:700;color:#EDEFF4;letter-spacing:-0.01em;line-height:1.1;">Right Price Auto Sales</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Source badge bar -->
  <tr><td style="background:#f9f9f9;padding:10px 24px;border-bottom:1px solid #e5e7eb;">
    <span style="background:#C49A3C;color:#0C0D0F;font-size:10px;font-weight:700;padding:3px 10px;text-transform:uppercase;letter-spacing:0.1em;">${sourceLabel}</span>
    <span style="color:#9ca3af;font-size:11px;margin-left:10px;">Source: rightpriceautosales.net</span>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:28px 28px 8px;">
    <h1 style="margin:0 0 20px;font-size:21px;color:#111;font-weight:800;line-height:1.25;">${emailSubject}</h1>

    <!-- Lead details table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;">
      <tr><td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;background:#f9fafb;">
        <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;">Lead Details</span>
      </td></tr>
      <tr><td style="padding:14px 16px;">
        <table cellpadding="0" cellspacing="0" style="font-size:14px;color:#374151;width:100%;">
          <tr><td style="padding:4px 0;color:#6b7280;width:130px;">Name</td><td style="font-weight:600;">${payload.name}</td></tr>
          ${payload.phone ? `<tr><td style="padding:4px 0;color:#6b7280;">Phone</td><td><a href="tel:${payload.phone}" style="color:#C49A3C;text-decoration:none;font-weight:600;">${payload.phone}</a></td></tr>` : ''}
          ${payload.email ? `<tr><td style="padding:4px 0;color:#6b7280;">Email</td><td><a href="mailto:${payload.email}" style="color:#C49A3C;text-decoration:none;font-weight:600;">${payload.email}</a></td></tr>` : ''}
          ${voiBlock}
        </table>
        ${messageBlock}
      </td></tr>
    </table>

    ${printBtn}
    ${vehicleCard}
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:24px 28px;text-align:center;border-top:1px solid #f3f4f6;margin-top:20px;">
    <p style="color:#9ca3af;font-size:11px;margin:0;line-height:1.6;">
      &copy; ${year} Target Market Center &nbsp;&middot;&nbsp; Right Price Auto Sales Inc<br>
      <a href="https://rpas-ruddy.vercel.app/" style="color:#C49A3C;text-decoration:none;">rightpriceautosales.net</a>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <a href="mailto:andrewammons@gmail.com" style="color:#9ca3af;text-decoration:none;">Unsubscribe</a>
    </p>
  </td></tr>

</table>
</td></tr></table>
</body>
</html>`;
}

export async function notifyNewLead(payload: NotifyPayload): Promise<void> {
  const formattedName = formatName(payload.name);
  const sourceLabel   = SOURCE_LABELS[payload.leadType] ?? payload.leadType;

  // Look up vehicle by VIN for credit apps
  let vehicle: VehicleInfo | null = null;
  if (payload.vin) {
    vehicle = await lookupVehicle(payload.vin);
  }

  const notifyEmail  = process.env.NOTIFY_EMAIL  || 'andrewammons@gmail.com';
  const resendKey    = process.env.RESEND_API_KEY;
  const twilioSid    = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken  = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom   = process.env.TWILIO_FROM;
  const twilioTo     = process.env.TWILIO_TO;

  // ── Email ──────────────────────────────────────────────────────────
  if (resendKey) {
    try {
      const subject = payload.leadType === 'credit_app'
        ? `${formattedName} Submitted A New Loan Application`
        : `New ${sourceLabel} — ${formattedName}`;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from:     'Right Price Auto Sales <leads@trgtmrkt.com>',
          to:       [notifyEmail],
          reply_to: notifyEmail,
          subject,
          html: buildEmailHtml(payload, vehicle, formattedName),
        }),
      });
      if (!res.ok) console.error('[notify] Resend error:', await res.json());
    } catch (e: any) {
      console.error('[notify] Email send failed:', e.message);
    }
  }

  // ── SMS ────────────────────────────────────────────────────────────
  if (twilioSid && twilioToken && twilioFrom && twilioTo) {
    try {
      const vehicleText  = vehicle ? ` | ${vehicle.year} ${vehicle.make} ${vehicle.model}` : '';
      const contactText  = [payload.phone, payload.email].filter(Boolean).join(' | ');
      const body = [
        `New Lead — ${sourceLabel}`,
        `${formattedName}${vehicleText}`,
        contactText,
      ].filter(Boolean).join('\n');

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ To: twilioTo, From: twilioFrom, Body: body }).toString(),
        }
      );
      if (!res.ok) console.error('[notify] Twilio error:', await res.json());
    } catch (e: any) {
      console.error('[notify] SMS send failed:', e.message);
    }
  }
}
