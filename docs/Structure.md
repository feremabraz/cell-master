# Folder structure plan

```
cell-master/
├── app/                             
│   ├── api/                        # API routes for server-side rules
│   │   └── rules/resolveAction.ts  # Rule resolver
│   └── game/                       # Game UI routes
│       └── [sessionId]/page.tsx    # Dynamic game session per user memory
├── lib/                            # 
│   ├── dice.ts                     # Dice roller
│   ├── random.ts                   # Random tables/utilities
│   ├── narrative.ts                # Narration formatter and stylizer
│   └── logger.ts                   # Optional debug/logger
├── store/                          # 
│   ├── playerAtoms.ts              # Player state (stats, location, etc.)
│   ├── worldAtoms.ts               # World state (encounters, areas, time)
│   ├── aiAtoms.ts                  # Memory session, Vercel AI state, mem0
│   └── sessionAtoms.ts             # Game session ID, event log, etc.
├── rules/                          # OSRIC-based game engine
│   ├── types.ts                    # Shared types/interfaces (Spell, etc.)
│   ├── character/                  # Player/monster stats modifiers
│   │   ├── abilities.ts
│   │   ├── characterClass.ts
│   │   └── hp.ts
│   ├── combat/                     # Attack rolls, initiative, damage, etc.
│   │   ├── attackRoll.ts
│   │   ├── initiative.ts
│   │   └── damage.ts
│   ├── spells/                     # Spell lookup, resolution, effects
│   │   ├── spellList.ts
│   │   └── spellResolver.ts
│   ├── savingThrows.ts             # Resolve saves against traps, etc.
│   ├── skills.ts                   # Sneak, climb, perception, etc.
│   ├── travel/                     # Movement, exploration, encounter rolls
│   │   ├── movement.ts
│   │   ├── terrain.ts
│   │   └── encounter.ts
│   ├── monsters/                   # Monster stat blocks and behaviors
│   │   ├── goblin.ts
│   │   └── orc.ts
│   └── rulesEngine.ts              # Rules used by the AI interpreter
├── ai/                             #
│   ├── interpreter.ts              # Translates player intent into rules
│   ├── planner.ts                  # AI pre-plans possible responses
│   ├── output.ts                   # Generates narrative responses
│   ├── themes.ts                   # Reskinning (fantasy, sci-fi, modern)
│   └── memory.ts                   # mem0 story persistence
└── __tests__/                          # 
    ├── rules/                      # e.g. test attackRoll, savingThrows
    └── ai/                         # e.g. interpreter intent mapping tests
```
