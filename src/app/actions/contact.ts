'use server';

import { supabase } from '@/lib/supabase';

const DEALERSHIP_ID = 'c0e0a112-83d3-4a83-81f4-5ac11b3b87c7';

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

export async function submitContactLead(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = formData.get('name')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim();
  const email = formData.get('email')?.toString().trim() || null;

  const inquiryType = formData.get('inquiryType')?.toString().trim();
  const contactMethod = formData.get('contactMethod')?.toString().trim();
  const vehicleOfInterest = formData.get('vehicleOfInterest')?.toString().trim() || 'N/A';
  const downPayment = formData.get('downPayment')?.toString().trim() || 'N/A';
  const zipCode = formData.get('zipCode')?.toString().trim();
  const creditScore = formData.get('creditScore')?.toString().trim();
  const message = formData.get('message')?.toString().trim() || '';
  
  // Robust additional fields
  const bestTime = formData.get('bestTime')?.toString().trim() || 'N/A';
  const employmentStatus = formData.get('employmentStatus')?.toString().trim() || 'N/A';
  const referral = formData.get('referral')?.toString().trim() || 'N/A';

  // Validation
  if (!name || !phone || !inquiryType || !contactMethod || !zipCode || !creditScore) {
    return {
      status: 'error',
      message: 'Name, Phone, Inquiry Type, Contact Method, Zip Code, and Credit Score are required.',
    };
  }

  // Format notes nicely for dealership review
  const notes = `
IN-DEPTH CONTACT INQUIRY
------------------------
Customer: ${name}
Phone: ${phone}
Email: ${email || 'None provided'}
Zip Code: ${zipCode}

Inquiry Details:
- Type of Inquiry: ${inquiryType}
- Preferred Contact: ${contactMethod} (Best Time: ${bestTime})
- Vehicle of Interest: ${vehicleOfInterest}
- Referral Source: ${referral}

Financial & Employment Profile:
- Self-Reported Credit: ${creditScore.toUpperCase()}
- Down Payment Ready: ${downPayment}
- Employment Status: ${employmentStatus}

Customer Message:
"${message || 'No additional message provided'}"
  `.trim();

  // Insert Lead to Supabase
  const { error } = await supabase.from('leads').insert({
    dealership_id: DEALERSHIP_ID,
    first_name: name,
    phone,
    email,
    notes,
    source: 'contact_form',
    utm: {},
  });

  if (error) {
    console.error('[contact lead submission] Supabase error:', error.message);
    return {
      status: 'error',
      message: 'Failed to submit inquiry. Please call us directly.',
    };
  }

  return { status: 'success', message: 'Success' };
}
