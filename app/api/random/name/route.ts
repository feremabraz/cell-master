import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import type { RandomNameRequest } from '@lib/random';
import type { CharacterRace, CharacterSex } from '@rules/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const options: RandomNameRequest = await request.json();

    if (!options.race || !options.sex || !options.nameType || !options.style) {
      return NextResponse.json(
        { error: 'Missing required parameters: race, sex, nameType, and style are required' },
        { status: 400 }
      );
    }

    const { race, sex, nameType, style } = options;

    const prompt = generateNamePrompt(race, sex, nameType, style);
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a name generator for a fantasy RPG based on OSRIC rules. 
          Generate appropriate names based on the race, sex, and style requested.
          Respond ONLY with the name, no explanations or additional text.`,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 30,
      temperature: 0.7,
    });

    const generatedName = completion.choices[0].message.content?.trim();

    if (generatedName) {
      return NextResponse.json({ name: generatedName });
    }

    throw new Error('No name was generated');
  } catch (error) {
    console.error('Error in random name API:', error);
    return NextResponse.json({ error: 'Failed to generate name' }, { status: 500 });
  }
}

function generateNamePrompt(
  race: CharacterRace,
  sex: CharacterSex,
  nameType: string,
  style: string
): string {
  return `Generate a ${style} ${race} ${sex} ${nameType} name for an OSRIC fantasy role-playing game.
          The name should feel authentic to the race and appropriate for the fantasy setting.
          RESPOND ONLY WITH THE NAME, NO EXPLANATIONS OR ADDITIONAL TEXT.`;
}
