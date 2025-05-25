# Firebase Studio
Mystic tarot guide to get cards reading.

Framework: Next.js
npm -v: 11.1.0
node -v: v20.17.0

# Requirements:
Google Gemini API key

# Build project:
npm install
npm run build

# Start project locally:
npm run start

# Build docker image:
docker build -t tarot-guide .

# Run application:
create mysecrets.env file with GEMINI_API_KEY=<YOUR API KEY>
docker run -d --env-file ./mysecrets.env --restart always -p 3000:3000 tarot-guide
