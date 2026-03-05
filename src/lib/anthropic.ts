/**
 * myAfya-AI — Anthropic AI Client
 * Provides AI health assistance using Claude
 */
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── System Prompt ────────────────────────────────────────────────────────────

export const HEALTH_ASSISTANT_SYSTEM_PROMPT = `You are myAfya-AI, an intelligent and empathetic AI health assistant built into the myAfya-AI medication management platform. You assist users with:

1. **Medication Information**: Explain how medications work, their uses, and mechanisms of action
2. **Safety Guidance**: Provide warnings about potential drug interactions, contraindications, and side effects
3. **Dosage Guidance**: Help users understand proper dosage timing, what to do if a dose is missed
4. **General Health Insights**: Offer evidence-based health tips, lifestyle recommendations
5. **Medication Adherence**: Motivate and support users to maintain their medication schedule
6. **Health Monitoring**: Interpret health data and suggest when to consult healthcare providers

**Important Guidelines:**
- Always recommend consulting a qualified healthcare provider for specific medical decisions
- Never replace professional medical advice, diagnosis, or treatment
- Be empathetic, clear, and use accessible language
- Format responses with markdown for clarity (bold, bullets, sections)
- For drug interactions, always urge consultation with a pharmacist or physician
- Keep responses focused, practical, and actionable
- If asked about emergencies, always direct to emergency services first

**Response Style:**
- Professional yet warm and caring
- Evidence-based and accurate
- Concise but thorough
- Use clear headings and bullet points for complex information
- Include relevant safety warnings when appropriate`;

// ─── AI Chat Function ─────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendHealthMessage(
  messages: ChatMessage[],
  userContext?: {
    medicines?: string[];
    allergies?: string[];
    conditions?: string[];
  }
): Promise<string> {
  let systemPrompt = HEALTH_ASSISTANT_SYSTEM_PROMPT;

  // Add user-specific context if available
  if (userContext) {
    systemPrompt += '\n\n**Current User Context:**';
    if (userContext.medicines?.length) {
      systemPrompt += `\n- Current medications: ${userContext.medicines.join(', ')}`;
    }
    if (userContext.allergies?.length) {
      systemPrompt += `\n- Known allergies: ${userContext.allergies.join(', ')}`;
    }
    if (userContext.conditions?.length) {
      systemPrompt += `\n- Medical conditions: ${userContext.conditions.join(', ')}`;
    }
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI');
  }

  return content.text;
}

// ─── Prescription Analysis ────────────────────────────────────────────────────

export async function analyzePrescription(extractedText: string): Promise<{
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration?: string;
    instructions?: string;
  }>;
  doctorName?: string;
  clinicName?: string;
  patientName?: string;
  issuedDate?: string;
}> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Extract and structure the medication information from this prescription text. Return ONLY valid JSON in this exact format:
{
  "medicines": [
    {
      "name": "Medicine name",
      "dosage": "e.g. 500mg",
      "frequency": "e.g. twice daily",
      "duration": "e.g. 7 days",
      "instructions": "e.g. take with food"
    }
  ],
  "doctorName": "Doctor name if present",
  "clinicName": "Clinic name if present",
  "patientName": "Patient name if present",
  "issuedDate": "Date if present"
}

Prescription text:
${extractedText}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Invalid response');

  try {
    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('Failed to parse prescription data');
  }
}

// ─── Health Insights ──────────────────────────────────────────────────────────

export async function generateDailyHealthInsight(context: {
  medicines: string[];
  adherenceRate: number;
  conditions: string[];
}): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Generate a brief, personalized daily health insight (2-3 sentences) for someone with:
- Medications: ${context.medicines.join(', ') || 'none listed'}
- Medication adherence: ${context.adherenceRate}%
- Conditions: ${context.conditions.join(', ') || 'none listed'}

Be motivational, practical, and specific. Keep it encouraging and actionable.`,
      },
    ],
  });

  const content = response.content[0];
  return content.type === 'text' ? content.text : 'Stay consistent with your medications today for optimal health outcomes.';
}
