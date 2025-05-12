# Cell Master Implementation Plan

Implementing Cell Master with Vercel AI SDK and Mem0: An Incremental Approach
Based on your detailed GM Rulebook and Game Document, here's a comprehensive guide to implementing your text adventure RPG using Vercel AI SDK with Mem0. I'll break this down into incremental phases, focusing on both functionality and UI considerations.

## Phase 1: Core Game Engine & Memory Structure

### Step 1: Setting Up the Memory Architecture

```typescript
// Define memory structure for Mem0
interface GameState {
  // World state
  worldSeed: string;
  regions: Region[];
  factions: Faction[];
  worldMatrix: Cell[][];
  
  // Player state
  character: Character;
  inventory: Item[];
  reputation: Record<string, number>; // Faction ID -> reputation score
  
  // Game progression
  currentAct: number;
  completedQuests: string[];
  activeQuests: Quest[];
  
  // Session data
  sessionLogs: SessionLog[];
}

// Helper function to initialize game state
async function initializeGameState(userId: string, worldSeed: string) {
  const gameState: GameState = {
    worldSeed,
    regions: [],
    factions: [],
    worldMatrix: [],
    // ... initialize other properties
  };
  
  // Store initial game state in Mem0
  await addMemories([
    { 
      role: "system", 
      content: [{ type: "text", text: JSON.stringify(gameState) }]
    }
  ], { user_id: userId });
}
```

### Step 2: Enhanced AI Route with System Prompts

```typescript
// app/api/game/route.ts
import { streamText } from 'ai';
import { createMem0 } from '@mem0/vercel-ai-provider';

export async function POST(req: Request) {
  const { command, userId } = await req.json();
  
  // Create Mem0 instance
  const mem0 = createMem0({
    provider: 'openai',
    mem0ApiKey: process.env.MEM0_API_KEY,
    apiKey: process.env.OPENAI_API_KEY,
    mem0Config: {
      user_id: userId,
      project_id: process.env.MEM0_PROJECT_ID,
      org_id: process.env.MEM0_ORG_ID,
    },
  });
  
  // Core system prompt based on GM Rulebook
  const systemPrompt = `You are the Game Master for "Cell Master", a text-based RPG.
  
  # Game Master Responsibilities
  - Generate and maintain a consistent world
  - Narrate scenes and adjudicate player actions
  - Manage NPCs, factions, and world state
  - Track player progression and adapt the story
  
  # Core Mechanics
  - Use dice rolls for resolution (/roll command)
  - Track attributes: STR, DEX, CON, INT, WIS, CHA
  - Manage combat using zones and abstract positioning
  - Track faction reputation on a scale of -5 to +5
  
  # World Structure
  - Regions with unique terrain and characteristics
  - Settlements with NPCs and points of interest
  - Factions with goals and inter-relationships
  
  Always stay in character as the Game Master. Never break the fourth wall.`;
  
  // Stream the response
  const result = streamText({
    model: mem0('gpt-4o', { user_id: userId }),
    system: systemPrompt,
    prompt: command,
    temperature: 0.7,
    maxTokens: 800,
  });
  
  // Return the stream
  return new Response(result.textStream);
}
```

## Phase 2: Character Creation & Game Initialization

### Step 1: Character Creation UI

```typescript
// components/character-creation.tsx
'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { userIdAtom } from '@/store/game-store';
import { Card, Button, Input, Select } from '@/components/ui';

export function CharacterCreation() {
  const [userId] = useAtom(userIdAtom);
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    name: '',
    attributes: {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8
    },
    background: '',
    skills: [],
    talents: []
  });
  
  const handleCreateCharacter = async () => {
    // Initialize game with character data
    const response = await fetch('/api/game/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        character,
        worldSeed: 'Ashenvale' // Could be user input
      })
    });
    
    if (response.ok) {
      // Redirect to game screen
      window.location.href = '/game';
    }
  };
  
  return (
    <Card className="bg-black border-green-500 text-green-500 p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-mono mb-6">Character Creation</h2>
      
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl">Basic Information</h3>
          <Input 
            placeholder="Character Name" 
            value={character.name}
            onChange={(e) => setCharacter({...character, name: e.target.value})}
            className="bg-black border-green-500 text-green-500"
          />
          <Button onClick={() => setStep(2)}>Next</Button>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl">Attributes (15 points)</h3>
          {/* Attribute allocation UI */}
          <Button onClick={() => setStep(3)}>Next</Button>
        </div>
      )}
      
      {/* Additional steps for skills, background, etc. */}
      
      {step === 5 && (
        <div className="space-y-4">
          <h3 className="text-xl">Review & Confirm</h3>
          {/* Character summary */}
          <Button onClick={handleCreateCharacter}>Begin Adventure</Button>
        </div>
      )}
    </Card>
  );
}
```

### Step 2: Game Initialization API

```typescript
// app/api/game/initialize/route.ts
import { createMem0, addMemories } from '@mem0/vercel-ai-provider';

export async function POST(req: Request) {
  const { userId, character, worldSeed } = await req.json();
  
  try {
    // Create initial game state
    const gameState = {
      character,
      worldSeed,
      currentAct: 1,
      regions: [],
      factions: [],
      reputation: {},
      inventory: [],
      quests: [],
      sessionLogs: []
    };
    
    // Store in Mem0
    await addMemories([
      { 
        role: "system", 
        content: [{ 
          type: "text", 
          text: `GAME_STATE: ${JSON.stringify(gameState)}` 
        }]
      }
    ], { 
      user_id: userId,
      mem0ApiKey: process.env.MEM0_API_KEY,
      project_id: process.env.MEM0_PROJECT_ID,
      org_id: process.env.MEM0_ORG_ID
    });
    
    // Generate world using AI
    const mem0 = createMem0({
      provider: 'openai',
      mem0ApiKey: process.env.MEM0_API_KEY,
      apiKey: process.env.OPENAI_API_KEY,
      mem0Config: { user_id: userId, project_id: process.env.MEM0_PROJECT_ID, org_id: process.env.MEM0_ORG_ID },
    });
    
    const worldGenPrompt = `
    Initialize a new world for Cell Master with the seed "${worldSeed}".
    
    1. Create 3-6 regions with unique terrain types
    2. Generate 4-7 factions with goals and relationships
    3. Initialize a world matrix (50x50)
    4. Place the player character in a starting location
    
    Return the data in a structured JSON format.
    `;
    
    const worldData = await mem0('gpt-4o').complete(worldGenPrompt);
    
    // Parse and store world data
    const parsedWorldData = JSON.parse(worldData.text);
    
    await addMemories([
      { 
        role: "system", 
        content: [{ 
          type: "text", 
          text: `WORLD_DATA: ${JSON.stringify(parsedWorldData)}` 
        }]
      }
    ], { 
      user_id: userId,
      mem0ApiKey: process.env.MEM0_API_KEY,
      project_id: process.env.MEM0_PROJECT_ID,
      org_id: process.env.MEM0_ORG_ID
    });
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Game initialization error:', error);
    return new Response(JSON.stringify({ error: 'Failed to initialize game' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

## Phase 3: Game Interface & Command Processing

### Step 1: Enhanced Game Interface

```typescript
// components/game-interface.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { motion } from 'motion/react';
import { userIdAtom, gameHistoryAtom } from '@/store/game-store';
import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { CommandInput } from './command-input';
import { GameHistory } from './game-history';
import { CharacterSheet } from './character-sheet';
import { Inventory } from './inventory';
import { QuestLog } from './quest-log';
import { WorldMap } from './world-map';

export function GameInterface() {
  const [userId] = useAtom(userIdAtom);
  const [gameHistory, setGameHistory] = useAtom(gameHistoryAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('game');
  
  // Process special commands like /roll
  const processCommand = async (command: string) => {
    setIsLoading(true);
    setGameHistory((prev) => [...prev, `> ${command}`]);
    
    // Handle special commands
    if (command.startsWith('/roll')) {
      const rollPattern = /\/roll\s+(\d+)d(\d+)(?:\s*\+\s*(\d+))?/;
      const match = command.match(rollPattern);
      
      if (match) {
        const [, numDice, dieSize, modifier] = match;
        const rolls = [];
        let total = 0;
        
        for (let i = 0; i < parseInt(numDice); i++) {
          const roll = Math.floor(Math.random() * parseInt(dieSize)) + 1;
          rolls.push(roll);
          total += roll;
        }
        
        if (modifier) {
          total += parseInt(modifier);
        }
        
        const rollResult = `Rolled ${numDice}d${dieSize}${modifier ? ' + ' + modifier : ''}: [${rolls.join(', ')}]${modifier ? ' + ' + modifier : ''} = ${total}`;
        
        setGameHistory((prev) => [...prev, rollResult]);
        
        // Send roll result to AI
        await sendToAI(`The player rolled ${rollResult}`);
      } else {
        setGameHistory((prev) => [...prev, 'Invalid roll format. Use /roll XdY+Z']);
      }
      
      setIsLoading(false);
      return;
    }
    
    // Regular command
    await sendToAI(command);
    setIsLoading(false);
  };
  
  const sendToAI = async (command: string) => {
    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      // Process streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body is null');
      
      let accumulatedText = '';
      const newHistory = [...gameHistory, `> ${command}`];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        accumulatedText += chunk;
        
        setGameHistory([...newHistory, accumulatedText]);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      setGameHistory((prev) => [...prev, 'Something went wrong. Please try again.']);
    }
  };
  
  return (
    <Card className="w-full h-[90vh] flex flex-col bg-black border-2 border-green-500 rounded-none">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <TabsList className="bg-black border-b border-green-500 rounded-none">
          <TabsTrigger value="game" className="text-green-500 data-[state=active]:bg-green-900">Game</TabsTrigger>
          <TabsTrigger value="character" className="text-green-500 data-[state=active]:bg-green-900">Character</TabsTrigger>
          <TabsTrigger value="inventory" className="text-green-500 data-[state=active]:bg-green-900">Inventory</TabsTrigger>
          <TabsTrigger value="quests" className="text-green-500 data-[state=active]:bg-green-900">Quests</TabsTrigger>
          <TabsTrigger value="map" className="text-green-500 data-[state=active]:bg-green-900">Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="game" className="flex-1 flex flex-col p-0 m-0">
          <div className="flex-1 overflow-y-auto p-4">
            <GameHistory />
          </div>
          <CommandInput onSubmitCommand={processCommand} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="character" className="flex-1 overflow-y-auto p-4">
          <CharacterSheet userId={userId} />
        </TabsContent>
        
        <TabsContent value="inventory" className="flex-1 overflow-y-auto p-4">
          <Inventory userId={userId} />
        </TabsContent>
        
        <TabsContent value="quests" className="flex-1 overflow-y-auto p-4">
          <QuestLog userId={userId} />
        </TabsContent>
        
        <TabsContent value="map" className="flex-1 overflow-y-auto p-4">
          <WorldMap userId={userId} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
```

### Step 2: Specialized Memory Retrieval Components

```typescript
// components/character-sheet.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import { getMemories } from '@mem0/vercel-ai-provider';

export function CharacterSheet({ userId }: { userId: string }) {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchCharacter() {
      try {
        // Retrieve character data from Mem0
        const memories = await getMemories("CHARACTER_DATA", {
          user_id: userId,
          mem0ApiKey: process.env.NEXT_PUBLIC_MEM0_API_KEY,
          project_id: process.env.NEXT_PUBLIC_MEM0_PROJECT_ID,
          org_id: process.env.NEXT_PUBLIC_MEM0_ORG_ID
        });
        
        if (memories && memories.length > 0) {
          // Find the most recent character data
          const characterData = memories
            .filter(memory => memory.text.includes("CHARACTER_DATA"))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
          
          if (characterData) {
            // Extract and parse the character data
            const jsonStr = characterData.text.replace("CHARACTER_DATA: ", "");
            setCharacter(JSON.parse(jsonStr));
          }
        }
      } catch (error) {
        console.error("Error fetching character data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCharacter();
  }, [userId]);
  
  if (loading) {
    return <div className="text-green-500">Loading character data...</div>;
  }
  
  if (!character) {
    return <div className="text-green-500">No character data found.</div>;
  }
  
  return (
    <Card className="bg-black border-green-500 text-green-500 p-4">
      <h2 className="text-xl font-mono mb-4">{character.name}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg mb-2">Attributes</h3>
          <ul className="space-y-1">
            <li>STR: {character.attributes.strength}</li>
            <li>DEX: {character.attributes.dexterity}</li>
            <li>CON: {character.attributes.constitution}</li>
            <li>INT: {character.attributes.intelligence}</li>
            <li>WIS: {character.attributes.wisdom}</li>
            <li>CHA: {character.attributes.charisma}</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg mb-2">Skills</h3>
          <ul className="space-y-1">
            {character.skills.map((skill, index) => (
              <li key={index}>{skill.name}: +{skill.bonus}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg mb-2">Background</h3>
        <p>{character.background}</p>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg mb-2">Talents</h3>
        <ul className="space-y-1">
          {character.talents.map((talent, index) => (
            <li key={index}>{talent.name}: {talent.description}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
```

## Phase 4: Advanced Game Mechanics & World State

### Step 1: Command Parser for Special Actions

```typescript
// lib/command-parser.ts
import { getMemories, addMemories } from '@mem0/vercel-ai-provider';

export async function parseCommand(command: string, userId: string) {
  // Roll dice
  if (command.startsWith('/roll')) {
    return handleRollCommand(command, userId);
  }
  
  // Locate something on the map
  if (command.startsWith('/locate')) {
    return handleLocateCommand(command, userId);
  }
  
  // Recall information from memory
  if (command.startsWith('/recall')) {
    return handleRecallCommand(command, userId);
  }
  
  // Regular command - pass to AI
  return null;
}

async function handleRollCommand(command: string, userId: string) {
  const rollPattern = /\/roll\s+(\d+)d(\d+)(?:\s*\+\s*(\d+))?/;
  const match = command.match(rollPattern);
  
  if (!match) {
    return 'Invalid roll format. Use /roll XdY+Z';
  }
  
  const [, numDice, dieSize, modifier] = match;
  const rolls = [];
  let total = 0;
  
  for (let i = 0; i < parseInt(numDice); i++) {
    const roll = Math.floor(Math.random() * parseInt(dieSize)) + 1;
    rolls.push(roll);
    total += roll;
  }
  
  if (modifier) {
    total += parseInt(modifier);
  }
  
  const rollResult = `Rolled ${numDice}d${dieSize}${modifier ? ' + ' + modifier : ''}: [${rolls.join(', ')}]${modifier ? ' + ' + modifier : ''} = ${total}`;
  
  // Store roll in memory
  await addMemories([
    { 
      role: "system", 
      content: [{ 
        type: "text", 
        text: `DICE_ROLL: ${rollResult}` 
      }]
    }
  ], { 
    user_id: userId,
    mem0ApiKey: process.env.MEM0_API_KEY,
    project_id: process.env.MEM0_PROJECT_ID,
    org_id: process.env.MEM0_ORG_ID
  });
  
  return rollResult;
}

async function handleLocateCommand(command: string, userId: string) {
  const target = command.replace('/locate', '').trim();
  
  // Retrieve world data from memory
  const memories = await getMemories("WORLD_DATA", {
    user_id: userId,
    mem0ApiKey: process.env.MEM0_API_KEY,
    project_id: process.env.MEM0_PROJECT_ID,
    org_id: process.env.MEM0_ORG_ID
  });
  
  // Process with AI to find the location
  const mem0 = createMem0({
    provider: 'openai',
    mem0ApiKey: process.env.MEM0_API_KEY,
    apiKey: process.env.OPENAI_API_KEY,
    mem0Config: { 
      user_id: userId, 
      project_id: process.env.MEM0_PROJECT_ID, 
      org_id: process.env.MEM0_ORG_ID 
    },
  });
  
  const locatePrompt = `
  The player is trying to locate "${target}" in the game world.
  Based on the world data and current game state, provide information about this location.
  If it's not found, suggest the closest matches or where they might find information about it.
  `;
  
  const response = await mem0('gpt-4o').complete(locatePrompt);
  return response.text;
}

// Similar implementations for other special commands
```

### Step 2: World State Management

```typescript
// lib/world-state.ts
import { getMemories, addMemories } from '@mem0/vercel-ai-provider';

export async function updateWorldState(userId: string, updates: Partial<GameState>) {
  try {
    // Get current world state
    const memories = await getMemories("GAME_STATE", {
      user_id: userId,
      mem0ApiKey: process.env.MEM0_API_KEY,
      project_id: process.env.MEM0_PROJECT_ID,
      org_id: process.env.MEM0_ORG_ID
    });
    
    let currentState = {};
    
    if (memories && memories.length > 0) {
      const gameStateMemory = memories
        .filter(memory => memory.text.includes("GAME_STATE"))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      if (gameStateMemory) {
        const jsonStr = gameStateMemory.text.replace("GAME_STATE: ", "");
        currentState = JSON.parse(jsonStr);
      }
    }
    
    // Merge updates with current state
    const updatedState = {
      ...currentState,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    // Store updated state
    await addMemories([
      { 
        role: "system", 
        content: [{ 
          type: "text", 
          text: `GAME_STATE: ${JSON.stringify(updatedState)}` 
        }]
      }
    ], { 
      user_id: userId,
      mem0ApiKey: process.env.MEM0_API_KEY,
      project_id: process.env.MEM0_PROJECT_ID,
      org_id: process.env.MEM0_ORG_ID
    });
    
    return updatedState;
  } catch (error) {
    console.error('Error updating world state:', error);
    throw error;
  }
}

export async function updateFactionReputation(userId: string, factionId: string, change: number) {
  try {
    // Get current world state
    const memories = await getMemories("GAME_STATE", {
      user_id: userId,
      mem0ApiKey: process.env.MEM0_API_KEY,
      project_id: process.env.MEM0_PROJECT_ID,
      org_id: process.env.MEM0_ORG_ID
    });
    
    let currentState: any = {};
    
    if (memories && memories.length > 0) {
      const gameStateMemory = memories
        .filter(memory => memory.text.includes("GAME_STATE"))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      if (gameStateMemory) {
        const jsonStr = gameStateMemory.text.replace("GAME_STATE: ", "");
        currentState = JSON.parse(jsonStr);
      }
    }
    
    // Update faction reputation
    const currentReputation = currentState.reputation?.[factionId] || 0;
    let newReputation = currentReputation + change;
    
    // Clamp reputation between -5 and +5
    newReputation = Math.max(-5, Math.min(5, newReputation));
    
    // Update state
    const updatedState = {
      ...currentState,
      reputation: {
        ...currentState.reputation,
        [factionId]: newReputation
      },
      lastUpdated: new Date().toISOString()
    };
    
    // Store updated state
    await addMemories([
      { 
        role: "system", 
        content: [{ 
          type: "text", 
          text: `GAME_STATE: ${JSON.stringify(updatedState)}` 
        }]
      }
    ], { 
      user_id: userId,
      mem0ApiKey: process.env.MEM0_API_KEY,
      project_id: process.env.MEM0_PROJECT_ID,
      org_id: process.env.MEM0_ORG_ID
    });
    
    return updatedState;
  } catch (error) {
    console.error('Error updating faction reputation:', error);
    throw error;
  }
}
```

## Phase 5: Enhanced AI Integration & Contextual Memory

### Step 1: Contextual Memory Retrieval

```typescript
// app/api/game/route.ts (enhanced)
import { streamText } from 'ai';
import { createMem0, getMemories } from '@mem0/vercel-ai-provider';
import { parseCommand } from '@/lib/command-parser';

export async function POST(req: Request) {
  const { command, userId } = await req.json();
  
  try {
    // Check for special commands
    const specialCommandResult = await parseCommand(command, userId);
    if (specialCommandResult) {
      return new Response(specialCommandResult);
    }
    
    // Create Mem0 instance
    const mem0 = createMem0({
      provider: 'openai',
      mem0ApiKey: process.env.MEM0_API_KEY,
      apiKey: process.env.OPENAI_API_KEY,
      mem0Config: {
        user_id: userId,
        project_id: process.env.MEM0_PROJECT_ID,
        org_id: process.env.MEM0_ORG_ID,
      },
    });
    
    // Retrieve relevant game state
    const gameStateMemories = await getMemories("GAME_STATE", {
      user_id: userId,
      mem0ApiKey: process.env.MEM0_API_KEY,
      project_id: process.env.MEM0_PROJECT_ID,
      org_id: process.env.MEM0_ORG_ID
    });
    
    let gameState = {};
    if (gameStateMemories && gameStateMemories.length > 0) {
      const latestState = gameStateMemories
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      if (latestState) {
        const jsonStr = latestState.text.replace("GAME_STATE: ", "");
        gameState = JSON.parse(jsonStr);
      }
    }
    
    // Build enhanced system prompt with game state context
    const systemPrompt = `You are the Game Master for "Cell Master", a text-based RPG.
    
    # Current Game State
    - Character: ${JSON.stringify(gameState.character || {})}
    - Current Act: ${gameState.currentAct || 1}
    - Current Location: ${gameState.currentLocation || "Unknown"}
    - Faction Reputations: ${JSON.stringify(gameState.reputation || {})}
    
    # Game Master Responsibilities
    - Generate and maintain a consistent world
    - Narrate scenes and adjudicate player actions
    - Manage NPCs, factions, and world state
    - Track player progression and adapt the story
    
    # Core Mechanics
    - Use dice rolls for resolution (/roll command)
    - Track attributes: STR, DEX, CON, INT, WIS, CHA
    - Manage combat using zones and abstract positioning
    - Track faction reputation on a scale of -5 to +5
    
    # World Structure
    - Regions with unique terrain and characteristics
    - Settlements with NPCs and points of interest
    - Factions with goals and inter-relationships
    
    Always stay in character as the Game Master. Never break the fourth wall.`;
    
    // Stream the response
    const result = streamText({
      model: mem0('gpt-4o', { user_id: userId }),
      system: systemPrompt,
      prompt: command,
      temperature: 0.7,
      maxTokens: 800,
    });
    
    // Return the stream
    return new Response(result.textStream);
  } catch (error) {
    console.error('Game API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process game command' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

### Step 2: Session Management & Logging

```typescript
```

---


## Incremental Implementation Plan

### Phase 1: Core Setup (Weeks 1-2)
1. Set up Mem0 integration with Vercel AI SDK
2. Implement basic game interface with command input
3. Create character creation flow
4. Establish memory structure for game state

### Phase 2: Game Mechanics (Weeks 3-4)
1. Implement dice rolling system
2. Add character sheet and inventory UI
3. Create world state management
4. Build faction reputation system

### Phase 3: Advanced Features (Weeks 5-6)
1. Implement special commands (/roll, /locate, /recall)
2. Add quest tracking system
3. Create session management and logging
4. Build world map visualization

### Phase 4: Polish & Refinement (Weeks 7-8)
1. Enhance UI with animations and transitions
2. Implement sound effects and ambient audio
3. Add accessibility features
4. Optimize performance and memory usage

## UI Considerations

1. **Terminal Aesthetic**:
   - Black background with green text (#22c55e)
   - VT323 font for terminal-like monospace text
   - Squared corners for UI elements
   - Subtle scan line effect for immersion

2. **Game Interface Layout**:
   - Main game area with scrolling text
   - Command input at bottom
   - Tabbed interface for character sheet, inventory, quests, and map
   - Status indicators for health, resources, and active effects

3. **Accessible Design**:
   - Accessible color scheme with high contrast

4. **Animation Considerations**:
   - Text appears with typewriter effect
   - Subtle pulse animations for important elements
   - Smooth transitions between tabs and panels

