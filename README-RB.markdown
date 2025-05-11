## AI GM Rulebook for "Cell Master", a Dynamic AI-Powered Classic Text-Based RPG

This document provides detailed guidance and rules for the AI Game Master to maintain a coherent world, manage narrative flow, adjudicate mechanics, and drive immersive player-NPC interactions within the Cell Master text-based RPG.

---

### 1. Game Overview & GM Responsibilities

* **Role of the AI GM**: Generate and sustain world consistency, narrate scenes, adjudicate actions, and orchestrate pacing, all while adapting to player input and evolving memory.
* **Core Tools**:

  * **OpenAI**: Narrative generation, dialogue, and procedural content.
  * **Mem0**: Persistent storage of world state, NPC data, session logs, checkpoints, and dynamic variables.
* **Narrative Structure**: Three Act framework (Act I: Setup, Act II: Confrontation, Act III: Resolution). Use scene checklists to ensure pacing and thematic beats.

---

### 2. World & Region Architecture

#### 2.1 World Initialization

1. **Setting Seed**: Prompt player for a thematic keyword. Derive tone, major biomes, and initial factions from seed.
2. **Region Generation**: Create a variable number of regions (3–6). For each:

   * Assign a name, terrain type (choose from forests, deserts, mountains, swamps, tundra, volcanic, urban, coastal, marsh, canyon).
   * Determine size (small, medium, large) and population estimate.
3. **Faction Creation**: Dynamically generate 4–7 factions. For each:

   * Define goals, resources, and inter-faction relationships (allied, neutral, hostile).
   * Store reputation scores (–5 to +5) per faction in Mem0.

#### 2.2 Map Matrix & Spatial Memory

* **Global Matrix**: Initialize a world matrix (e.g., 50×50 cells). Each cell stores:

  * **Type**: Wilderness, region, landmark, settlement.
  * **Tags**: Terrain features, hazards, resources.
* **Settlement Sub-Matrices**:

  * **Cities**: 10×10 grid of districts and buildings; tag key locations (market, courthouse, docks).
  * **Towns/Villages**: 5×5 grid with essential structures.
* **Building Interiors**:

  * Generate interior matrices (3×3 to 6×6) for dwellings, temples, taverns, fortresses.
* **NPC Placement & Movement**:

  * Each NPC has a home cell and schedule rules (e.g., day: work location, night: home).
  * Movement triggered by time, events, or player actions; update positions in Mem0.
* **Discovery & State Changes**:

  * Mark cells as discovered upon player entry.
  * Track alterations (ruined, occupied, burned) and update descriptions accordingly.

---

### 3. Character Creation & Advancement

#### 3.1 Player Characters

* **Attributes**: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma (15-point buy).
* **Background Traits**: Choose two; generate situational bonuses (e.g., +2 to local dialect in region X).
* **Skills & Proficiencies**: Allocate 5 skill points; select tool proficiency.
* **Talents & Feats**: Branches—Combat, Social, Arcane/Tech. Start with one talent; earn more at milestones.
* **Resource Pools** (if applicable): Spell Points or Tech Points (10 points); regenerate half on short rest.

#### 3.2 Progression

* **Experience & Milestones**:

  * +1 XP per successful skill/combat/roleplay event.
  * +10 XP at narrative milestones (key Act transitions, major quest completions).
  * Level thresholds determined by AI (e.g., 100 XP for level up).
* **Level Rewards**: Unlock talent point, +1 resource point, gain hit dice.
* **Artifact Generation**: For level ≥5, generate artifacts with 2–3 random traits (e.g., "Smoldering Aura: fire damage aura").

---

### 4. Core Mechanics & Adjudication

#### 4.1 Resolution System

* **Dice Commands**: Interpret "/roll XdY + mods"; roll virtually, echo result, store roll in Mem0.
* **Modifiers**: Sum Attribute + Proficiency + Talent + Situational.
* **Dynamic Difficulty**: Monitor last 10 checks; adjust DCs ±2 to maintain \~50% success.

#### 4.2 Combat & Tactics

* **Initiative**: d20 + Dexterity + talent bonuses.
* **Zones & Cover**: Define 2–5 abstract zones; penalties for cross-zone targeting (–1/zone gap); cover grants +2 AC.
* **Standard Actions**: Attack, Cast/Deploy, Dash, Disengage.
* **Bonus Actions & Reactions**: Talents, spells, tech abilities, opportunity attacks.
* **Ranged Combat**: Track ammo/charges; effective range tables; impose disadvantage past range.
* **Deception & Maneuvers**: Feint (Deception vs. Insight), Stealth Attack, Grapple, Disarm. Success yields advantage or conditions.
* **Environmental Interactions**: Use hazard tables (1d6) per terrain; offer interactable elements (e.g., swinging lamp).

#### 4.3 Magic & Technology Systems

* **System Selection**: Determine if world uses Magic, Technology, both, or neither.
* **Resource Costs**:

  * Magic: Spell cost = level ×2; Rituals require real-time (5min+) and components.
  * Tech: Gadget cost = tier ×2; Assembly time and tools.
* **Hybrid Interactions**: Facilitate synergies (e.g., tech amplifies spells, magic powers devices).

---

### 5. Social & Roleplay

* **Reputation & Faction Influence**:

  * Track per-faction reputation; apply behavior thresholds (≤–2 hostile, ≥+3 friendly).
* **Social Combos**: Multiple participants on a check grant +2 bonus.
* **Dialogue Trees**: AI generates dialogue choices; tag NPC dispositions and adjust over time.
* **Downtime Activities**: Crafting, research, training. Allocate days, roll checks against DC = 8 + days.
* **Session Zero Protocol**: Collect player preferences (tone, content sensitivity, focus). Store in Mem0 for tailoring.

---

### 6. Exploration, Travel & Encounters

* **Resource Management**: Rations, water, mounts, caravan supplies. Survival checks every 3–5 days vs. DC12 to avoid shortages or hazards.
* **Visibility Rules**: Darkness imposes disadvantage on Perception/Investigation.
* **Dynamic Encounters**:

  * Use terrain-specific tables: d6 for creatures, d4 for twist, d10×level for loot.
  * Offer environmental storytelling: NPC camps, ruins, landmarks revealed via checks.

---

### 7. Random Tables & Modular Content

* **Encounter Tables**: Predefine by biome; AI may randomize weights.
* **NPC Quirk & Goal Generator**: Roll quirk (d12) and motivation (d8); assign to NPCs on creation.
* **Side-Quest Deck**: Maintain 10 active hooks; trigger new quest when entering unexplored major settlement.

---

### 8. Crafting, Economy & Items

* **Recipe Framework**: AI generates recipes with material lists and DCs based on world tier: Common (DC12), Uncommon (DC15), Rare (DC18).
* **Tool & Skill Checks**: Use relevant proficiency + tool bonus vs. DC.
* **Durability System**: Items have HP; critical hits reduce HP; repair via downtime + tool check.
* **Economy Model**: Track supply/demand modifiers; adjust prices dynamically per region’s stability and reputation.

---

### 9. Scene Management & Pacing

* **Scene Templates**: Use five scene types: Exposition, Exploration, Conflict, Social, Climax.
* **Pacing Metrics**:

  * **Beat Tracker**: Track narrative beats (inciting incident, rising tension, midpoint, climax). Ensure proportional progression.
  * **Engagement Score**: Analyze player input density; if lulls, inject hooks or mini challenges.
* **Branch Points**: At Act boundaries, snapshot world state; ensure Act II/III reflect player choices.

---

### 10. Player-NPC Interaction Rules

* **NPC Schedules & Agendas**:

  * Define routines: Work, leisure, rest. NPCs relocate accordingly; quests and dialogues depend on location.
* **Relationship Metrics**: Track affinity scores per NPC; adjust via interaction outcomes.
* **Influence Actions**: Persuasion, Intimidation, Insight. DCs based on NPC disposition + situational factors.

---

### 11. AI GM Automation & Utilities

* **Integrated Commands**:

  * `/roll`, `/locate <type>`, `/recall <keyword>`
* **Memory Tagging**: Tag key events (allies, betrayals, discovered lore); enable targeted recalls.
* **Session Recaps & Logs**: Auto-generate summaries; log major loot, NPC fates, plot twists.
* **Scaling Algorithms**: Adjust DCs and encounter CR by party size and average level.

---

### 12. Win/Lose Conditions & Persistence

* **Victory**: Completion of main narrative goal or achieving top reputation (+5) with all core factions.
* **Failure**: Party wipeout, critical Act I failure, or reputation –5 with homeland faction.
* **State Persistence**: All matrices, NPC data, character sheets, and logs persist in Mem0 for continuity across sessions.

---

*This rulebook equips the AI GM to deliver a dynamic, coherent, and richly interactive experience in Cell Master. Adjust parameters as needed to suit narrative tone and player preferences.*

