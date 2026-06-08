'use server';

import { supabase } from '@/lib/supabase';

const DEALERSHIP_ID = 'c0e0a112-83d3-4a83-81f4-5ac11b3b87c7';

export type SellState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

// Generates a professional appraisal brief that dealership staff can read.
// Ready to be replaced/augmented with an actual LLM (Gemini/Ollama) API call.
function generateAppraisalBrief(
  year: string,
  make: string,
  model: string,
  miles: number,
  condition: string,
  minVal: number,
  maxVal: number
): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `### 🚗 VEHICLE APPRAISAL BRIEF (AI Generated)
Generated on: ${dateStr}

#### **Vehicle Overview**
* **Year/Make/Model:** ${year} ${make} ${model}
* **Mileage:** ${miles.toLocaleString()} miles
* **Reported Condition:** ${condition.toUpperCase()}
* **Estimated Market Value:** $${minVal.toLocaleString()} - $${maxVal.toLocaleString()}

---

#### **Dealership Acquisition Analysis**
1. **Demand & Velocity:** A ${year} ${make} ${model} with ${miles.toLocaleString()} miles generally has a **Moderate-to-High** resale velocity in Middle Tennessee.
2. **Reconditioning Estimation:** Based on a reported condition of "${condition}", anticipate standard reconditioning costs of $1,200 – $2,500 (brakes, tires, detailed cleanup) to get it lot-ready.
3. **Margin Potential:** If acquired around $${(minVal * 0.95).toFixed(0)}, retail pricing targets could sit around $${(maxVal * 1.1).toFixed(0)}, yielding an estimated gross margin of $2,000 – $3,500.

#### **Recommended Action Plan for Right Price Rep:**
* **Verify VIN & Title status** (look for salvage/rebuilt history, common in local trade-ins).
* **Focus inspection on:** Transmissions & suspension mounts (common watch-points for ${make} models of this vintage).
* **Target Offer Range:** Start discussion at **$${(minVal * 0.9).toFixed(0)}** and cap at **$${minVal.toFixed(0)}** for a quick in-and-out wholesale flip, or go up to **$${(minVal * 1.05).toFixed(0)}** if keeping for BHPH inventory.
`;
}

export async function submitVehicleSaleLead(
  _prevState: SellState,
  formData: FormData
): Promise<SellState> {
  const name = formData.get('name')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim();
  const email = formData.get('email')?.toString().trim() || null;
  
  const year = formData.get('year')?.toString().trim();
  const make = formData.get('make')?.toString().trim();
  const model = formData.get('model')?.toString().trim();
  const milesRaw = formData.get('miles')?.toString().trim();
  const condition = formData.get('condition')?.toString().trim() || 'good';

  // Validation
  if (!name || !phone || !year || !make || !model || !milesRaw) {
    return { status: 'error', message: 'All vehicle and contact fields are required.' };
  }

  const miles = parseInt(milesRaw, 10);
  if (isNaN(miles)) {
    return { status: 'error', message: 'Mileage must be a valid number.' };
  }

  // Local/math-based valuation matching client-side calculations
  const basePrice = 35000; 
  const age = Math.max(0, new Date().getFullYear() - parseInt(year, 10));
  const ageDepreciation = basePrice * (1 - Math.pow(0.85, age)); 
  const mileageDepreciation = miles * 0.12; 
  
  let currentVal = Math.max(1500, basePrice - ageDepreciation - mileageDepreciation);
  
  // Condition modifier
  if (condition === 'excellent') currentVal *= 1.15;
  if (condition === 'good') currentVal *= 1.00;
  if (condition === 'fair') currentVal *= 0.80;
  if (condition === 'poor') currentVal *= 0.55;

  const minVal = Math.round(currentVal * 0.9);
  const maxVal = Math.round(currentVal * 1.1);

  // Generate staff appraisal report (can easily hook up an LLM api here)
  const appraisalBrief = generateAppraisalBrief(
    year,
    make,
    model,
    miles,
    condition,
    minVal,
    maxVal
  );

  const notes = `
CUSTOMER IS SELLING THEIR VEHICLE.
----------------------------------
Vehicle: ${year} ${make} ${model}
Mileage: ${miles.toLocaleString()} mi
Condition: ${condition}
Instant Estimate: $${minVal.toLocaleString()} - $${maxVal.toLocaleString()}

${appraisalBrief}
  `.trim();

  // Insert Lead to Supabase
  const { error } = await supabase.from('leads').insert({
    dealership_id: DEALERSHIP_ID,
    first_name: name,
    phone,
    email,
    notes,
    source: 'sell_form',
    utm: {},
  });

  if (error) {
    console.error('[sell lead submission] Supabase error:', error.message);
    return {
      status: 'error',
      message: 'Failed to submit lead. Please call us directly.',
    };
  }

  return { status: 'success', message: 'Success' };
}
