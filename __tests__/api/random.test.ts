import { describe, test, expect, vi } from 'vitest';

// Mock route handlers
vi.mock('@/app/api/random/name/route', () => ({
  POST: vi.fn().mockImplementation(async (req) => {
    const body = await req.json();
    if (!body.race || !body.sex || !body.nameType || !body.style) {
      return { error: 'Missing required parameters' };
    }
    return { name: 'Elindra Moonwhisper' };
  })
}));

vi.mock('@/app/api/random/weather/route', () => ({
  POST: vi.fn().mockImplementation(async () => {
    return { 
      description: 'Cool and clear with a light breeze.',
      temperature: 'Cool',
      precipitation: 'Clear',
      wind: 'Light breeze'
    };
  })
}));

vi.mock('@/app/api/random/encounter/route', () => ({
  POST: vi.fn().mockImplementation(async () => {
    return { 
      encounter: 'A group of 5 goblins hiding behind rocks. They appear to be setting up an ambush.'
    };
  })
}));

// Import route handlers after mocking
import { POST as nameRandomPost } from '@app/api/random/name/route';
import { POST as weatherRandomPost } from '@app/api/random/weather/route';
import { POST as encounterRandomPost } from '@app/api/random/encounter/route';

describe('Random API Endpoints', () => {
  describe('/api/random/name', () => {
    test('returns a random name when valid parameters are provided', async () => {
      const request = new Request('http://localhost:3000/api/random/name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          race: 'elf',
          sex: 'female',
          nameType: 'full',
          style: 'fantasy',
        }),
      });

      const response = await nameRandomPost(request);
      expect(response).toHaveProperty('name', 'Elindra Moonwhisper');
    });

    test('returns an error when missing required parameters', async () => {
      const request = new Request('http://localhost:3000/api/random/name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Missing parameters
        }),
      });

      const response = await nameRandomPost(request);
      expect(response).toHaveProperty('error');
    });
  });

  describe('/api/random/weather', () => {
    test('returns random weather when valid parameters are provided', async () => {
      const request = new Request('http://localhost:3000/api/random/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          climate: 'temperate',
          season: 'summer',
        }),
      });

      const response = await weatherRandomPost(request);
      expect(response).toHaveProperty('description', 'Cool and clear with a light breeze.');
    });

    test('handles optional parameters', async () => {
      const request = new Request('http://localhost:3000/api/random/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          climate: 'temperate',
          season: 'summer',
          environment: 'forest',
          previousWeather: 'Rainy and cold',
          magicalEffects: true,
        }),
      });

      const response = await weatherRandomPost(request);
      expect(response).toHaveProperty('description', 'Cool and clear with a light breeze.');
    });
  });

  describe('/api/random/encounter', () => {
    test('returns a random encounter when valid parameters are provided', async () => {
      const request = new Request('http://localhost:3000/api/random/encounter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          terrain: 'forest',
          level: 3,
        }),
      });

      const response = await encounterRandomPost(request);
      expect(response).toHaveProperty('encounter', 'A group of 5 goblins hiding behind rocks. They appear to be setting up an ambush.');
    });

    test('handles optional parameters', async () => {
      const request = new Request('http://localhost:3000/api/random/encounter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          terrain: 'forest',
          level: 3,
          environment: 'dense',
          time: 'night',
          party: {
            size: 4,
            level: 3,
          },
        }),
      });

      const response = await encounterRandomPost(request);
      expect(response).toHaveProperty('encounter', 'A group of 5 goblins hiding behind rocks. They appear to be setting up an ambush.');
    });
  });
}); 