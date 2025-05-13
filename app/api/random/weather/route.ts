import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import type { Environment } from '@/rules/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface WeatherRequest {
  climate: string;
  season: string;
  environment?: Environment | string;
  previousWeather?: string;
  magicalEffects?: boolean;
}

export async function POST(request: Request) {
  try {
    const options: WeatherRequest = await request.json();
    const { climate, season, environment, previousWeather, magicalEffects } = options;

    const prompt = generateWeatherPrompt(climate, season, environment, previousWeather, magicalEffects);
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a weather generator for a fantasy RPG based on OSRIC rules. 
          Generate appropriate weather conditions based on the climate, season, and environment.
          Respond ONLY with the weather description, no explanations or additional text.`,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const generatedWeather = completion.choices[0].message.content?.trim();

    if (generatedWeather) {
      // Parse the weather into components if possible
      const components = parseWeatherComponents(generatedWeather);
      return NextResponse.json(components);
    }
    
    throw new Error('No weather was generated');
  } catch (error) {
    console.error('Error in random weather API:', error);
    return NextResponse.json(
      { error: 'Failed to generate weather' },
      { status: 500 }
    );
  }
}

function parseWeatherComponents(weatherDescription: string) {
  // Try to extract temperature, precipitation, wind
  // This is a best-effort parsing, since AI output may vary
  const components: {
    temperature?: string;
    precipitation?: string;
    wind?: string;
    description: string;
  } = {
    description: weatherDescription
  };
  
  // Try to extract temperature
  const tempKeywords = [
    'freezing', 'cold', 'cool', 'mild', 'warm', 'hot', 'sweltering',
    'frigid', 'chilly', 'brisk', 'pleasant', 'balmy', 'tropical', 'scorching'
  ];
  
  // Try to extract precipitation
  const precipKeywords = [
    'clear', 'sunny', 'cloudy', 'overcast', 'fog', 'mist', 'drizzle', 
    'rain', 'shower', 'downpour', 'storm', 'thunderstorm', 'snow', 'sleet', 'hail'
  ];
  
  // Try to extract wind
  const windKeywords = [
    'calm', 'still', 'breeze', 'wind', 'gust', 'blustery', 'howling', 'gale'
  ];
  
  // Simple extraction based on keywords
  const words = weatherDescription.toLowerCase().split(/\s+/);
  
  for (const word of words) {
    if (!components.temperature) {
      const tempWord = tempKeywords.find(keyword => word.includes(keyword));
      if (tempWord) {
        components.temperature = tempWord;
      }
    }
    
    if (!components.precipitation) {
      const precipWord = precipKeywords.find(keyword => word.includes(keyword));
      if (precipWord) {
        components.precipitation = precipWord;
      }
    }
    
    if (!components.wind) {
      const windWord = windKeywords.find(keyword => word.includes(keyword));
      if (windWord) {
        components.wind = windWord;
      }
    }
  }
  
  return components;
}

function generateWeatherPrompt(
  climate: string,
  season: string,
  environment?: Environment | string,
  previousWeather?: string,
  magicalEffects?: boolean
): string {
  let prompt = `Generate realistic weather conditions for a ${climate} climate during ${season}`;
  
  if (environment) {
    prompt += ` in a ${environment} environment`;
  }
  
  if (previousWeather) {
    prompt += `. The previous day's weather was: ${previousWeather}`;
  }
  
  if (magicalEffects) {
    prompt += '. Include minor magical effects that might influence the weather in a fantasy world';
  }
  
  prompt += '.\n\n  Describe:\n  - Temperature conditions\n  - Precipitation or lack thereof\n  - Wind conditions\n  - Any special atmospheric effects\n\n  RESPOND ONLY WITH THE WEATHER DESCRIPTION ITSELF, KEEP IT CONCISE (1-3 SENTENCES), NO EXPLANATIONS OR ADDITIONAL TEXT.';
  
  return prompt;
} 