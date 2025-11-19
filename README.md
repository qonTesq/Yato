# Yato Discord Bot

> ⚠️ Archived: This repository is now a public archive. The bot code is preserved for educational/reference purposes and may no longer function without updates (Discord API changes, library deprecations, dependency vulnerabilities, etc.). Use or deploy at your own discretion.

Yato is a multifunctional Discord bot providing moderation, social, utility, media, and community engagement capabilities through modern slash commands (and some legacy message-based commands). It was built as a student / learning project and showcases structured command handling, external API integrations (anime/manga data, images, game server stats), database persistence, and interaction-based UX.

## Feature Highlights

- Moderation: Kick, ban, mute, purge, role management.
- Social & Roleplay: Reactions (hug, kiss, etc.), memes, playful interactions.
- Anime & Manga: AniList & MyAnimeList (via Jikan) lookups.
- Media / Images: Dynamic Canvas-based welcome cards or generated graphics.
- Music / Voice (legacy): Basic queue & playback (Discord.js v12 era approach, requires rewrite for current API & intents).
- Logging: Joins/leaves, moderation events (if configured).
- Utility: Announcements, server stats, time utilities.
- Slash Commands: Implemented via `gcommands` for structured interactions.
- Database: MongoDB (Mongoose) for persistence (e.g., guild config, user data, tokens).
- Game Server Stats: Via `gamedig` (e.g., Minecraft, CS servers).
- Configurable environment via `.env`.

## Tech Stack

| Layer           | Library / Service                              | Notes                                                  |
| --------------- | ---------------------------------------------- | ------------------------------------------------------ |
| Core Bot        | discord.js `^12.5.3`                           | Outdated; upgrade required for current API (v14+).     |
| Slash Framework | gcommands `^5.2.4`                             | May no longer be maintained; consider native builders. |
| Database        | Mongoose + MongoDB                             | Optional (only if persistence features used).          |
| External APIs   | AniList (`anilist-node`), Jikan (`jikan-node`) | Anime & manga lookups.                                 |
| Canvas / Images | `canvas`                                       | For welcome images or generated assets.                |
| Utilities       | `moment`, `ms`, `diff`, `colors`               | Formatting & developer helpers.                        |
| Game Stats      | `gamedig`                                      | Query game server info.                                |
| Environment     | `dotenv`                                       | Load `.env` config.                                    |

## Requirements

- Node.js: v14–16 was the target at the time (discord.js v12).  
  For modern use: Upgrade to Node 18+ and migrate to discord.js v14.
- npm or yarn
- (Optional) MongoDB instance
- Discord Application (Bot) w/ proper intents:
  - If updating: Enable Privileged Gateway Intents for Member / Presence if needed.

## Installation

```bash
git clone https://github.com/qonTesq/Yato.git
cd Yato
npm install
```

## Environment Variables

Create a `.env` file in project root:

```dotenv
TOKEN=your_discord_bot_token
CLIENT_ID=your_bot_application_client_id
GUILD_ID=optional_test_guild_id   # For quicker command registration (development)
MONGODB_URI=your_mongo_connection_string_optional
```

Additional (if you extend):

```dotenv
LOG_CHANNEL_ID=
WELCOME_CHANNEL_ID=
```

## Running the Bot

Development (with auto-restart if you add nodemon):

```bash
npm run dev
```

Basic start (if entry is `src/index.js`):

```bash
node src/index.js
```

There is no build step in the current `package.json` (no TypeScript config present). If you migrate to TypeScript, add:

```json
"scripts": {
  "dev": "nodemon .",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

## Project Structure (Simplified)

(This may differ from actual layout, adjust as needed.)

```
Yato/
├─ src/
│  ├─ index.js                # Bot startup
│  ├─ commands/               # Slash / legacy commands
│  ├─ events/                 # Event handlers (guildMemberAdd, message, interactionCreate)
│  ├─ utils/                  # Helpers (formatting, API wrappers)
│  ├─ services/               # External integrations (anime, game stats)
│  ├─ database/               # Mongoose models & connection
│  └─ config/                 # Constants / settings
├─ package.json
├─ .env.example
└─ README.md
```

## Security Considerations

- Never commit `.env`.
- Restrict elevated commands to admin roles or explicit role IDs.
- Validate external API inputs to avoid injection or overflow.
- Monitor rate limits (Discord & 3rd-party APIs).
- Sanitize user-generated text before rendering on Canvas.

## Documentation

Original (if still live):  
[Command Documentation](https://yatobot.vercel.app/commands/)
