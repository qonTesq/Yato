---

*This repository is now a public archive. The bot and its build may no longer function as intended due to outdated dependencies, changes in the Discord API, or other factors. While the codebase remains available for reference, it may require significant updates to work with current systems. For active use, consider forking and updating the code or exploring alternative bots!*

# Yato Discord Bot

Yato is a versatile Discord bot. With approximately 50 commands across various categories, Yato enhances your Discord server experience by providing tools for moderation, fun interactions, logging, and more. Whether you're managing a community or just having fun with friends, Yato has you covered.

## Features

Yato packs a punch with a wide range of functionalities designed to make server management and engagement effortless. Key highlights include:

- **Moderation Tools**: Keep your server safe with commands for kicking, banning, muting, and more.
- **Welcome & Logging**: Customizable welcome messages (including images) and detailed server activity logs.
- **Fun & Social Commands**: Memes, hugs, kisses and roleplay actions to lighten the mood.
- **Music & Voice**: Play, queue, and control music tracks directly in voice channels.
- **Utility Commands**: Role management, announcements.
- **Customization**: Slash commands for seamless integration with Discord's modern UI, supporting mobile-friendly interactions.

For a full list of commands, check out the [official command documentation](https://yatobot.vercel.app/commands/).

**Note**: Commands are primarily slash-based (`/` prefix), but some legacy message-based commands may be available. The bot requires appropriate permissions (e.g., Manage Roles, Send Messages) to function fully.

## Installation & Setup

Since Yato is open-source, you can self-host it for full control over your instance. Here's a quick guide:

### Prerequisites
- Node.js (v16+ recommended)
- A Discord bot application (create one at the [Discord Developer Portal](https://discord.com/developers/applications))
- Git installed

### Steps
1. **Clone the Repository**:
   ```
   git clone https://github.com/qonTesq/Yato.git
   cd Yato
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```
   This installs `gcommands` and other required packages like `discord.js`.

3. **Configure Environment**:
   - Create a `.env` file in the root directory.
   - Add your bot token and other configs:
     ```
     TOKEN=your_discord_bot_token_here
     CLIENT_ID=your_bot_client_id
     GUILD_ID=your_server_id_for_testing (optional)
     ```
   - For database (if used, e.g., MongoDB): Add `MONGODB_URI=your_mongo_connection_string`.

4. **Build & Run**:
   ```
   npm run build  # If using TypeScript; skip if JS-only
   node index.js  # Or npm start
   ```

5. **Invite the Bot**:
   - Use the OAuth2 URL generator in the Developer Portal to invite your bot to servers with necessary scopes (e.g., `bot`, `applications.commands`).

6. **Deploy Commands**:
   - The bot uses gcommands for automatic slash command registration. Run once to sync:
     ```
     node deploy-commands.js  # Assumes a deploy script exists; create if needed
     ```

### Hosting Options
- **Local**: For testing.
- **VPS/Cloud**: Heroku, Vercel for 24/7 uptime.
- **Sharding**: For large-scale use, configure sharding in the code.

## Notes

- This is a student project for educational purposes.
