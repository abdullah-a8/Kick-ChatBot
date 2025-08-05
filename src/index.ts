import "dotenv/config";
import { createClient, type MessageData } from "@retconned/kick-js";

const BOT = process.env.KICK_USERNAME!;
const CHANNELS = ["ms-gunfighter", "jennaronis"] as const;
const COMMANDS: { [key: string]: string } = {
  hi: "Hello! How are you?",
  hello: "Hi there! Welcome to the stream!",
  hey: "Hey! What's up?"
};

async function login(client: ReturnType<typeof createClient>) {
  if (process.env.KICK_OTP_SECRET) {
    await client.login({
      type: "login",
      credentials: {
        username: BOT,
        password: process.env.KICK_PASSWORD!,
        otp_secret: process.env.KICK_OTP_SECRET
      }
    });
  } else {
    await client.login({
      type: "tokens",
      credentials: {
        bearerToken: process.env.KICK_BEARER!,
        xsrfToken: process.env.KICK_XSRF!,
        cookies: process.env.KICK_COOKIES!
      }
    });
  }
}

async function main() {
  // Create multiple clients for multiple channels
  const clients: Array<ReturnType<typeof createClient>> = [];
  
  for (const channelName of CHANNELS) {
    const client = createClient(channelName, { logger: true, readOnly: false });
    await login(client);
    
    // Wait for client to be ready
    await new Promise<void>(resolve =>
      client.on("ready", () => {
        console.log(`🚀 Logged in as ${client.user?.tag} for channel ${channelName}`);
        resolve();
      })
    );

    // Listen for chat messages
    client.on("ChatMessage", async (message: MessageData) => {
      const text = message.content.trim().toLowerCase();

      console.log(`[${channelName}] ${message.sender.username}: ${message.content}`);

      // Check for commands
      const cmdName = Object.keys(COMMANDS).find(cmd => text === `!${cmd}`);
      if (cmdName) {
        const reply = COMMANDS[cmdName];
        try {
          await client.sendMessage(reply);
          console.log(`[BOT → ${channelName}]: ${reply}`);
        } catch (err) {
          console.error("⚠️ sendMessage failed:", err);
        }
      }
    });

    clients.push(client);
    console.log(`✅ Connected to ${channelName}`);
  }

  console.log(`🤖 Bot is monitoring ${CHANNELS.length} channels: ${CHANNELS.join(", ")}`);
}

main().catch(err => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});