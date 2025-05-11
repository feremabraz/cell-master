import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, body } = await req.json();
    const { command, gameHistory } = body || {};

    // Create a system prompt for the text adventure game
    const systemPrompt = `You are the Game Master for a text adventure game called "Cell Master". 
The player is the protagonist who has awakened in a mysterious facility.

Your responses should be atmospheric, immersive, and written in second person perspective.
Keep responses concise (1-3 paragraphs) and focused on advancing the story based on the player's commands.

If this is the first interaction, provide an engaging opening scene that sets the tone for a sci-fi mystery.
Otherwise, respond to the player's command in a way that moves the story forward.

The game has a retro terminal aesthetic, so your responses should fit this theme.
Use vivid descriptions that engage the senses and create tension.

IMPORTANT: Never break character or acknowledge that you are an AI. Always respond as if you are the game itself.`;

    // Prepare the context from game history
    let context = '';
    if (gameHistory && gameHistory.length > 0) {
      // Convert game history to a string context
      context = gameHistory
        .map((message: string) => {
          if (message.startsWith('> ')) {
            return `Player: ${message.substring(2)}`;
          }
          return `Game: ${message}`;
        })
        .join('\n');
    }

    // Use the streamText function to generate a streaming response
    const result = streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      prompt: `${context ? `${context}\n` : ''}Player: ${command || prompt}`,
      temperature: 0.7,
      maxTokens: 500,
    });
    
    // Create a TransformStream to clean the response
    const { readable, writable } = new TransformStream();
    
    // Start streaming the response
    const textStream = result.textStream;
    
    // Process the stream to remove metadata
    (async () => {
      const writer = writable.getWriter();
      
      try {
        for await (const chunk of textStream) {
          // Write only the text content to the output stream
          await writer.write(new TextEncoder().encode(chunk));
        }
      } catch (error) {
        console.error('Error processing stream:', error);
      } finally {
        await writer.close();
      }
    })();
    
    // Return the cleaned response
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('AI API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate AI response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
