# AJAX Bot

A TypeScript-based Discord bot using Discord.js.

## Installation

```bash
# Clone repository
git clone <your-repository-url>
cd ajax_bot

# Install dependencies
npm install

# Create configuration file
cp config.yml.example config.yml
# Open config.yml and set your bot token
```

## Running the Bot

Run in development mode:

```bash
npm run dev
```

Build and run:

```bash
npm run build
npm start
```

Build with live updates:

```bash
npm run watch
```

## Configuration

In the `config.yml` file, you only need to set the bot token:

```yaml
token: "your_discord_bot_token_here"  # Bot token created in the Discord Developer Portal
```

## Server Optimization

This bot is optimized for a specific server (ID: 1280402790354649110). Slash commands are registered only for this server and won't work on other servers. To use it on different servers, modify the `SERVER_ID` constant in the `src/index.ts` file.

## Features

### Slash Commands

- `/ping` - Check the bot's response time and API latency
- `/정보` - View detailed information about the bot (embed format)
- `/서버정보` - View detailed information about the current server (embed format)
- `/echo [text]` - The bot repeats the text you input
- `/ai [model] [question]` - Ask a question to AI and receive a response
  - Model selection: Gemini 2.5 Pro Preview 03-25, Gemini 2.0 Flash
  - Response is displayed in embed format
  - Currently, API integration is not implemented (in development)

### Automated Features

- **Mention Response**: The bot automatically responds when mentioned
- **New Member Welcome**: Sends a welcome message when new members join the server

## Intent Settings

This bot runs with all intents enabled. You need to activate the following intents in the Discord Developer Portal:

- PRESENCE INTENT
- SERVER MEMBERS INTENT
- MESSAGE CONTENT INTENT

## Development Information

- Node.js
- TypeScript
- Discord.js
- YAML

## License

ISC

## Docker Deployment

This project can be easily deployed using Docker.

### Prerequisites
1. Install [Docker](https://www.docker.com/get-started)
2. Install [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Setup
1. Copy `.env.example` to create an `.env` file
   ```bash
   cp .env.example .env
   ```
2. Enter your Discord bot token and Google API key in the `.env` file
   ```
   BOT_TOKEN=your_discord_bot_token_here
   GOOGLE_API_KEY=your_google_api_key_here
   ```
3. Copy `config.yml.example` to create a `config.yml` file (if needed)
   ```bash
   cp config.yml.example config.yml
   ```

### Running the Container
Build and run the Docker container with the following command:
```bash
docker compose up -d
```

### Checking Logs
```bash
docker logs -f discord-bot
```

### Stopping the Container
```bash
docker compose down
```

### Update Process
When code changes occur, rebuild and run the container with:
```bash
docker compose up -d --build
``` 