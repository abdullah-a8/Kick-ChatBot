# Kick ChatBot

A simple chatbot for Kick.com that monitors multiple channels and responds to commands.

## Features

- Monitors multiple Kick channels simultaneously
- Responds to chat commands with predefined messages
- Supports both credential-based and token-based authentication
- Built with TypeScript for type safety
- Uses Puppeteer for browser automation

## Prerequisites

Before you can run this bot locally, make sure you have the following installed:

### 1. Node.js (v18 or higher)

**Windows:**
- Download from [nodejs.org](https://nodejs.org/)
- Run the installer and follow the setup wizard
- Verify installation: `node --version`

**macOS:**
```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. pnpm Package Manager

After installing Node.js, install pnpm globally:

```bash
npm install -g pnpm
```

Verify installation:
```bash
pnpm --version
```

### 3. Git (for cloning the repository)

**Windows:** Download from [git-scm.com](https://git-scm.com/)
**macOS:** `brew install git` or use Xcode Command Line Tools
**Linux:** `sudo apt-get install git`

### 4. A Kick.com Account

You'll need a Kick.com account that will act as your bot. For best practices:
- Create a dedicated bot account (recommended)
- Or use your existing account (for testing)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abdullah-a8/Kick-ChatBot
cd Kick-ChatBot
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Install Chrome for Browser Automation

The bot uses Puppeteer for browser automation, which requires Chrome/Chromium:

```bash
npx puppeteer browsers install chrome
```

**Note:** This step is crucial as the `@retconned/kick-js` library uses browser automation to interact with Kick.com.

**Troubleshooting for Linux:**
If you encounter issues, you may need to install additional dependencies:

```bash
# Ubuntu/Debian
sudo apt-get install -y \
  libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 \
  libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
  libxtst6 ca-certificates fonts-liberation \
  libappindicator1 libnss3 lsb-release xdg-utils wget \
  libgbm1 libxkbcommon0 libgtk-3-0
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your bot credentials using your preferred text editor:

```bash
# Using nano
nano .env

# Using VS Code
code .env

# Using vim
vim .env
```

### 5. Authentication Setup

Choose **ONE** of the following authentication methods:

#### Option A: Username/Password + 2FA (Easier for Development)

1. **Enable 2FA on your Kick account:**
   - Go to [Kick Security Settings](https://kick.com/settings/security)
   - Enable Two-Factor Authentication
   - **Important:** When setting up 2FA, save the secret key (usually shown as a QR code)

2. **Configure in .env:**
   ```env
   KICK_USERNAME=your_bot_username
   KICK_PASSWORD=your_password
   KICK_OTP_SECRET=your_2fa_secret_key
   ```

#### Option B: Browser Tokens (Recommended for Production)

This method is more stable and doesn't require storing your password.

1. **Extract tokens from your browser:**
   - Login to [kick.com](https://kick.com) in your browser
   - Open Developer Tools (F12)
   - Go to **Network** tab
   - Refresh the page or navigate around kick.com
   - Look for any request to kick.com API endpoints
   - Click on a request and find the **Request Headers** section

2. **Extract the following tokens:**

   **Bearer Token:**
   - Look for: `Authorization: Bearer YOUR_TOKEN_HERE`
   - Copy everything after "Bearer "

   **XSRF Token:**
   - Look for: `X-XSRF-TOKEN: YOUR_XSRF_TOKEN`
   - Or check cookies for `XSRF-TOKEN=value`

   **Cookies:**
   - Go to **Application/Storage** tab → **Cookies** → **kick.com**
   - Copy ALL cookies as one string: `cookie1=value1; cookie2=value2; cookie3=value3`

3. **Configure in .env:**
   ```env
   KICK_USERNAME=your_bot_username
   KICK_BEARER=your_bearer_token
   KICK_XSRF=your_xsrf_token
   KICK_COOKIES=your_cookies_string
   ```

## Running the Bot

### Development Mode
```bash
pnpm dev
# or
pnpm start
```

### Production Mode
```bash
# Build the project
pnpm build

# Run the compiled version
pnpm start:prod
```

### Verify Bot is Working

You should see output like:
```
🚀 Logged in as YourBotName#1234 for channel channel1
✅ Connected to channel1
🚀 Logged in as YourBotName#1234 for channel channel2
✅ Connected to channel2
🤖 Bot is monitoring 2 channels: channel1, channel2
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

## Available Scripts

```bash
# Install dependencies and setup Chrome
pnpm install
npx puppeteer browsers install chrome

# Development - runs with hot reload
pnpm dev

# Start the bot
pnpm start

# Build TypeScript to JavaScript
pnpm build

# Run compiled version (after build)
pnpm start:prod
```

## Troubleshooting

### Common Issues

**1. "Chrome/Chromium not found" Error:**
```bash
# Run this to install Chrome for Puppeteer
npx puppeteer browsers install chrome
```

**2. "Authentication failed" Error:**
- Check your credentials in `.env`
- For token auth: tokens may have expired, re-extract them
- For password auth: ensure 2FA secret is correct

**3. "Permission denied to send messages":**
- Make sure your bot account can send messages in the target channels
- Some channels may require the bot to be a subscriber or have special permissions

**4. Linux Dependencies Error:**
```bash
# Install required libraries for Puppeteer on Linux
sudo apt-get install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm1 libxkbcommon0 libgtk-3-0
```

**5. Network/Proxy Issues:**
- Ensure your network allows connections to kick.com
- If behind a corporate firewall, you may need proxy configuration

### Debug Mode

To see more detailed logs, you can modify the client creation in `src/index.ts`:
```typescript
const client = createClient(channelName, { 
  logger: true,        // Already enabled
  readOnly: false,     // Allows sending messages
  debug: true          // Add this for more verbose logging
});
```

## Project Structure

```
Kick-ChatBot/
├── src/
│   └── index.ts              # Main bot logic
├── dist/                     # Compiled JavaScript (after build)
├── .env                      # Your credentials (not in git)
├── .env.example             # Template for credentials
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── TOKEN_EXTRACTION_GUIDE.md # Detailed token extraction guide
└── README.md                # This file
```

## Notes

- The bot responds only in the channel where the command was triggered
- Commands are case-insensitive  
- Make sure your bot account has permission to send messages in the target channels
- Tokens typically expire after 24-48 hours (for Option B authentication)
- For production use, consider using a dedicated bot account rather than your personal account

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [TOKEN_EXTRACTION_GUIDE.md](TOKEN_EXTRACTION_GUIDE.md) for authentication help
3. Open an issue on GitHub with detailed error messages and your setup information