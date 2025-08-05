# Kick ChatBot

A simple chatbot for Kick.com that monitors multiple channels and responds to commands.

## Features

- Monitors multiple Kick channels simultaneously
- Responds to chat commands with predefined messages
- Supports both credential-based and token-based authentication

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your bot credentials
   ```

3. **Authentication Options:**

   **Option A: Username/Password + 2FA (Recommended for development)**
   - Set `KICK_USERNAME`, `KICK_PASSWORD`, and `KICK_OTP_SECRET`
   - Get your OTP secret from https://kick.com/settings/security

   **Option B: Browser Tokens (Recommended for production)**
   - Set `KICK_USERNAME`, `KICK_BEARER`, `KICK_XSRF`, and `KICK_COOKIES`
   - Extract these from your browser's developer tools while logged into Kick

## Running the Bot

```bash
pnpm start
# or
npx tsx src/index.ts
```

## Configuration

### Channels
Edit the `CHANNELS` array in `src/index.ts` to monitor different channels:
```typescript
const CHANNELS = ["channel1", "channel2"] as const;
```

### Commands
Edit the `COMMANDS` object in `src/index.ts` to add/modify commands:
```typescript
const COMMANDS: { [key: string]: string } = {
  hi: "Hello! How are you?",
  hello: "Hi there! Welcome to the stream!",
  hey: "Hey! What's up?",
  // Add more commands here
};
```

## Usage

Once running, the bot will:
1. Connect to all specified channels
2. Listen for commands (e.g., `!hi`, `!hello`, `!hey`)
3. Respond with the configured messages
4. Log all activity to the console

## Notes

- The bot responds only in the channel where the command was triggered
- Commands are case-insensitive
- Make sure your bot account has permission to send messages in the target channels