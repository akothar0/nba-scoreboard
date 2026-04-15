FROM node:22-slim AS base

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/worker/package.json ./apps/worker/

# Install dependencies
RUN npm install --workspace=worker

# Copy source
COPY packages/shared/ ./packages/shared/
COPY apps/worker/ ./apps/worker/

# Build
RUN npm run build --workspace=@nba-scoreboard/shared
RUN npm run build --workspace=worker

CMD ["node", "apps/worker/dist/index.js"]
