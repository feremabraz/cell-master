# Cell Master

A dynamic AI-powered memory-based classical text-based RPG with persistent memory using Mem0.

![Preview](README.png)

## Features

- Text-based adventure game with a retro terminal aesthetic
- AI-powered game master that remembers the entire story
- Persistent memory using Mem0 with the Vercel AI SDK
- Unique user identification for personalized game experiences

## Technologies

- Next.js 15
- React 19
- Jotai for state management
- React Query for data fetching
- Motion (formerly Framer Motion) for animations
- Zod for form validation
- Biome for linting and formatting
- Shadcn/UI with Tailwind CSS for the UI
- Vercel AI SDK with OpenAI integration
- Mem0 for persistent memory

## Setup

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
MEM0_API_KEY=your_mem0_api_key
MEM0_PROJECT_ID=your_mem0_project_id
MEM0_ORG_ID=your_mem0_org_id
```

### Installation

```bash
pnpm install
pnpm dev
```

## Mem0 Integration

This project uses Mem0 with the Vercel AI SDK to provide persistent memory for the game master. The integration allows the AI to remember the entire story and provide a more immersive experience.

Key features of the Mem0 integration:

- Each user gets a unique ID for personalized game experiences
- The game master remembers all previous interactions
- The memory is stored securely in the Mem0 cloud
- The integration is seamless with the Vercel AI SDK

