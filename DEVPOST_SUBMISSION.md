# Devpost Submission Materials

## Project Name
**I-Q-Land**

## Elevator Pitch (180 chars max)
Daily brain training on Reddit! Solve logic puzzles, master ciphers, and challenge friends with custom riddles in I-Q-Land. 🧠✨

## Thumbnail Generation Prompt (Gemini)
> A futuristic, glowing digital landscape inside a isometric glass cube, floating cipher symbols and logic puzzle elements, neon blue and purple color palette, glassmorphism style, 3d render, high quality, 8k, cinematic lighting.

## Project Details (Markdown)

Copy the following block for the "About the Project" section:

```markdown
## Inspiration
We were inspired by the daily ritual of games like Wordle and the engaging nature of logic puzzle books. We wanted to bring that "aha!" moment directly to the Reddit feed, transforming passive scrolling into active brain training. We saw an opportunity to use Reddit's Devvit platform not just for a game, but for a community-driven puzzle ecosystem.

## What it does
**I-Q-Land** is a cipher-solving logic game embedded directly in a Reddit post.
- **Daily Challenges**: A new, unique puzzle generates every 24 hours.
- **Practice Mode**: An infinite stream of procedural puzzles to hone your skills.
- **Builder Mode**: Players can create their own custom puzzles (defining input/output examples and the logic) and post them as new Reddit posts for others to solve.
- **Progress Tracking**: Tracks your daily wins and solves.

## How we built it
We built I-Q-Land using the **Devvit** platform with a modern web stack:
- **Frontend**: React and Tailwind CSS for a sleek, glassmorphism UI.
- **Backend**: Hono.js running on Devvit's serverless infrastructure.
- **Storage**: Redis (via Devvit) for storing daily seeds, user states, and custom puzzle data.
- **Engine**: A custom TypeScript logic engine that generates shift, number-substitution, and reverse ciphers.

## Challenges we ran into
One significant technical hurdle was configuring the **TypeScript infrastructure**. We faced a complex conflict between Vite's "automatic" JSX runtime (standard for React apps) and Devvit's server-side custom JSX factory. We had to carefully re-architect the build configuration (`tsconfig` and `vite.config.ts`) to support a hybrid environment where client-side React and server-side Devvit layout components could coexist seamlessly.

## Accomplishments that we're proud of
- **Seamless Builder Mode**: Enabling users to create content that spawns *new* interactive Reddit posts feels like magic.
- **Visual Polish**: achieving a high-fidelity "glass" aesthetic that feels premium and responsive within the Reddit app constraints.
- **Robust Logic Engine**: The puzzle generator creates solvable but challenging patterns without manual intervention.

## What we learned
We learned a great deal about the **Devvit capabilities**, specifically how to bridge the gap between standard web development (React/Vite) and Reddit's custom runtimes. We also gained a deeper appreciation for state management in distributed apps, ensuring that "Daily" means the same puzzle for everyone, everywhere.

## What's next for I-Q-Land
- **Global Leaderboards**: To encourage friendly competition.
- **Multiplayer Battles**: Real-time head-to-head decoding races.
- **More Puzzle Types**: Adding visual logic puzzles and pattern recognition tasks beyond text ciphers.
```
