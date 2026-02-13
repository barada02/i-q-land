# I-Q-Land: Cipher Breaker 🧠

> **Crack the code. Reveal the wisdom.**

I-Q-Land is an immersive logic puzzle game built on Reddit's [Devvit](https://developers.reddit.com/) platform. Ideally suited for daily brain training, it challenges players to decode secret messages using various cipher techniques.

## Features

### 📅 Daily Challenge
Every day, a new unique puzzle is generated for the community. Compete with others to solve it and maintain your daily streak!

### ♾️ Practice Mode
Hone your skills with an endless stream of randomly generated puzzles. Great for warming up or passing time.

### 🛠️ Builder Mode
Have a clever riddle or a tough code? Use the **Builder Mode** to create your own custom puzzle and post it directly to the subreddit! Other users can play your creation right within your post.

### 🏆 Progress Tracking
- Tracks your daily completion status.
- Displays your Reddit avatar and username.
- (Coming Soon) Global leaderboards and streak tracking.

## Technical Stack

This project is built using the **Devvit React Starter** template and features:

- **Frontend**: [React](https://react.dev/) + [Vite](https://vite.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Hono](https://hono.dev/) (running on Devvit's Redis & Scheduler)
- **Database**: Devvit Redis Plugin for state management and puzzle storage
- **UI**: Custom Glassmorphism design system

## Getting Started

### Prerequisites
- Node.js 22+
- Devvit CLI (`npm install -g devvit`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Login to Reddit:
   ```bash
   devvit login
   ```

### Development

Start the local development server with hot-reloading:

```bash
npm run dev
```

This will launch a `playtest` session where you can interact with the app in a simulated Reddit environment.

## Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local dev server (Playtest) |
| `npm run build` | Builds client/server bundles |
| `npm run deploy` | Uploads a new version to Reddit |
| `npm run launch` | Publishes the app for review/public use |
| `npm run type-check` | Runs TypeScript validation |

## License

BSD-3-Clause
