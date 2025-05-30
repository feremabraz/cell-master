import { streamText } from 'ai';
import { createMem0 } from '@mem0/vercel-ai-provider';

export async function POST(req: Request) {
  try {
    const { prompt, body } = await req.json();
    const { command, gameHistory, userId } = body || {};

    // Create Mem0 instance with OpenAI provider
    const mem0 = createMem0({
      provider: 'openai',
      mem0ApiKey: process.env.MEM0_API_KEY,
      apiKey: process.env.OPENAI_API_KEY,
      config: {
        compatibility: 'strict',
      },
      mem0Config: {
        user_id: userId || 'default-user',
        project_id: process.env.MEM0_PROJECT_ID,
        org_id: process.env.MEM0_ORG_ID,
      },
    });

    const systemPrompt = `You are the Game Master for a text adventure game called "Cell Master". 
The player is the protagonist who has awakened in a mysterious facility.

Your responses should be atmospheric, immersive, and written in second person perspective.
Keep responses concise (1-3 paragraphs) and focused on advancing the story based on the player's commands.

If this is the first interaction, provide an engaging opening scene that sets the tone for a sci-fi mystery.
Otherwise, respond to the player's command in a way that moves the story forward.

The game has a retro terminal aesthetic, so your responses should fit this theme.
Use vivid descriptions that engage the senses and create tension.

Do not end responses with questions or prompts for action. Let the narrative flow naturally and allow the player to decide their next move without explicit prompting.

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

    // The memory will be automatically handled by the Mem0 provider

    // Use the streamText function with Mem0 to generate a streaming response with memory
    const result = streamText({
      model: mem0('gpt-4o', {
        user_id: userId || 'default-user',
      }),
      system: systemPrompt,
      prompt: `${context ? `${context}\n` : ''}Player: ${command || prompt}`,
      temperature: 0.7,
      maxTokens: 500,
    });

    // The memory is automatically stored by the Mem0 provider

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
    return new Response(JSON.stringify({ error: 'Failed to generate AI response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
