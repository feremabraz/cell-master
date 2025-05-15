import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import type { Environment, TerrainType } from '@rules/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EncounterRequest {
  terrain: TerrainType | string;
  level: number;
  environment?: Environment | string;
  time?: string;
  party?: {
    size: number;
    level: number;
  };
}

export async function POST(request: Request) {
  try {
    const options: EncounterRequest = await request.json();
    const { terrain, level, environment, time, party } = options;

    const prompt = generateEncounterPrompt(terrain, level, environment, time, party);
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an encounter generator for a fantasy RPG based on OSRIC rules. 
          Generate appropriate encounters based on the terrain, environment, character level, and time.
          Respond ONLY with the encounter description, no explanations or additional text.`,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const generatedEncounter = completion.choices[0].message.content?.trim();

    if (generatedEncounter) {
      return NextResponse.json({ encounter: generatedEncounter });
    }

    throw new Error('No encounter was generated');
  } catch (error) {
    console.error('Error in random encounter API:', error);
    return NextResponse.json({ error: 'Failed to generate encounter' }, { status: 500 });
  }
}

function generateEncounterPrompt(
  terrain: TerrainType | string,
  level: number,
  environment?: Environment | string,
  time?: string,
  party?: { size: number; level: number }
): string {
  let prompt = `Generate a detailed random encounter for level ${level} characters in ${terrain} terrain`;

  if (environment) {
    prompt += ` in a ${environment} environment`;
  }

  if (time) {
    prompt += ` during ${time}`;
  }

  if (party) {
    prompt += ` for a party of ${party.size} characters at level ${party.level}`;
  }

  prompt += `.
  
  Format:
  - [Monster/NPC] with their numbers if applicable. 
  - Brief description of what they're doing.
  - Initial reaction/disposition.
  - Any notable equipment, treasure, or information they might have.
  
  RESPOND ONLY WITH THE ENCOUNTER DESCRIPTION, NO EXPLANATIONS OR ADDITIONAL TEXT.`;

  return prompt;
}
