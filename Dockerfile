# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json* ./

# Install dependencies
# Using npm ci for cleaner installs based on package-lock.json
RUN npm ci

# Copy the rest of the application code
# This includes source files, tsconfig.json, next.config.ts, etc.
COPY . .

# Build the Next.js application
# The next.config.ts is already configured for 'standalone' output
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
# Disable Next.js telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED=1
# Set the port the app will run on. Default is 3000 for Next.js standalone.
ENV PORT=3000

# Copy the standalone output from the builder stage
# This includes the server.js and necessary node_modules
COPY --from=builder /app/.next/standalone ./

# Copy the public folder for static assets like images, fonts, etc.
COPY --from=builder /app/public ./public

# Copy the .next/static folder for built client-side assets (JS, CSS)
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
# This uses the server.js from the .next/standalone output
CMD ["node", "server.js"]
