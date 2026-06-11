'use server';

import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { notifyNewLead } from '@/lib/notify';

const DEALERSHIP_ID = 'c0e0a112-83d3-4a83-81f4-5ac11b3b87c7';

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

    // Non-fatal lead insert — name/phone/email only, no SSN or financial data
    const vin = rawData.vin || null;
    const { error: dbError } = await supabaseAdmin.from('leads').insert({
      dealership_id: DEALERSHIP_ID,
      first_name: rawData.name || 'Applicant',
      phone: rawData.phone || null,
      email: rawData.email || null,
      notes: `Full credit application submitted${vin ? '. Vehicle VIN: ' + vin : ''}. See email for full application details.`,
      source: 'credit_app',
      utm: {},
    });
    if (dbError) {
      console.error('[Credit Server Action] Lead insert failed:', dbError.message);
    }

    // Non-fatal notifications — email + SMS
    notifyNewLead({
      leadType: 'credit_app',
      name:     rawData.name || 'Applicant',
      phone:    rawData.phone || null,
      email:    rawData.email || null,
      vin,
      printUrl,
    }).catch(e => console.error('[Credit Server Action] Notify failed:', e.message));

    return {
      status: 'success',
      message: 'Application submitted successfully! Your data was sent securely to the dealer.',
      previewUrl: printUrl,
    };
  } catch (error: any) {
    console.error('[Credit Server Action] Submission error:', error);
    return {
      status: 'error',
      message: 'An error occurred during submission. Please contact the dealership directly.',
    };
  }
}
