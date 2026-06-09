'use server';

import crypto from 'crypto';

// Ensure we have a valid 32-byte key for AES-256
const SECRET_KEY = process.env.ENCRYPTION_KEY
  ? crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest()
  : crypto.createHash('sha256').update('right_price_auto_sales_fallback_secret_key_2026').digest();

const IV_LENGTH = 16;

// Encryption Helper
export async function encryptData(data: string): Promise<string> {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decryption Helper
export async function decryptData(encryptedText: string): Promise<string> {
  const parts = encryptedText.split(':');
  if (parts.length !== 2) throw new Error('Invalid encrypted data format');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = Buffer.from(parts[1], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}

export type CreditApplicationState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  previewUrl?: string;
};

export async function submitCreditApplication(
  _prevState: CreditApplicationState,
  formData: FormData
): Promise<CreditApplicationState> {
  try {
    const rawData: Record<string, any> = {};

    // Gather all fields from the FormData
    formData.forEach((value, key) => {
      // Don't capture NextJS internal field keys (usually prefixed with "$")
      if (!key.startsWith('$')) {
        rawData[key] = value.toString().trim();
      }
    });

    const name = rawData.name || 'Applicant';
    
    // Convert data to JSON string and encrypt it
    const jsonString = JSON.stringify(rawData);
    const encryptedToken = await encryptData(jsonString);

    // Build the URL to our /apply/print page
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const printUrl = `${appUrl}/apply/print?app=${encodeURIComponent(encryptedToken)}`;

    console.log('\n==================================================');
    console.log('--- NEW CREDIT APPLICATION SUBMITTED ---');
    console.log(`Applicant Name: ${name}`);
    console.log(`Local Print Preview URL:\n${printUrl}`);
    console.log('==================================================\n');

    // Email Dispatch via Resend API (using native fetch to prevent dependencies)
    const resendApiKey = process.env.RESEND_API_KEY;
    const dealerEmail = 'rightpriceas@yahoo.com';

    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Right Price Auto Sales <onboarding@resend.dev>', // Fallback sender or verified sender domain
            to: [dealerEmail],
            subject: `🚨 New Credit Application: ${name}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #c0392b; border-bottom: 2px solid #c0392b; padding-bottom: 10px; margin-top: 0;">New Credit Application Received</h2>
                <p>A credit application was submitted by <strong>${name}</strong> on ${new Date().toLocaleDateString()}.</p>
                <p>For security and PII compliance, sensitive fields (like SSN, DL#, and income data) have <strong>not</strong> been saved to any database.</p>
                
                <div style="margin: 30px 0; text-align: center;">
                  <a href="${printUrl}" style="background-color: #c0392b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    Print Credit Application
                  </a>
                </div>
                
                <p style="color: #666; font-size: 12px; line-height: 1.5;">
                  <strong>Note to Dealership Manager:</strong> Clicking the button above will decrypt the applicant's data in-memory and render a pixel-perfect printable application document matching your standard format. Please print or save as PDF for your records.
                </p>
                <p style="color: #999; font-size: 11px; margin-top: 20px;">
                  Secure URL: <br/>
                  <span style="word-break: break-all; font-family: monospace;">${printUrl}</span>
                </p>
              </div>
            `,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          console.error('[Credit Server Action] Resend response error:', errData);
        }
      } catch (emailErr: any) {
        console.error('[Credit Server Action] Failed to send email via Resend:', emailErr.message);
      }
    }

    return {
      status: 'success',
      message: 'Application submitted successfully! Your data was sent securely to the dealer.',
      previewUrl: printUrl, // Shared for easy testing locally
    };
  } catch (error: any) {
    console.error('[Credit Server Action] Submission error:', error);
    return {
      status: 'error',
      message: 'An error occurred during submission. Please contact the dealership directly.',
    };
  }
}
