'use server'

import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { notifyNewLead } from '@/lib/notify'

const DEALERSHIP_ID = 'c0e0a112-83d3-4a83-81f4-5ac11b3b87c7'

export type InquiryState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

export async function submitInquiry(
  _prevState: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const name = formData.get('name')?.toString().trim()
  const phone = formData.get('phone')?.toString().trim()
  const email = formData.get('email')?.toString().trim() || null
  const notes = formData.get('message')?.toString().trim() || null

  if (!name || !phone) {
    return { status: 'error', message: 'Name and phone are required.' }
  }

  const { error } = await supabaseAdmin.from('leads').insert({
    dealership_id: DEALERSHIP_ID,
    first_name: name,
    phone,
    email,
    notes,
    source: 'hero_form',
    utm: {},
  })

  if (error) {
    console.error('[inquiry] Supabase insert error:', error.message)
    return {
      status: 'error',
      message: 'Something went wrong. Please call us directly.',
    }
  }

  notifyNewLead({
    leadType: 'hero_form',
    name,
    phone,
    email,
    message: notes,
  }).catch(e => console.error('[inquiry] Notify failed:', e.message))

  return { status: 'success', message: '' }
}
