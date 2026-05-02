# packages/api/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace root
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy packages
COPY packages/shared ./packages/shared
COPY packages/api ./packages/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared
RUN pnpm --filter @playlink/shared run build

# Build API
RUN pnpm --filter @playlink/api run build

# Start
EXPOSE 3002
CMD ["node", "packages/api/dist/server.js"]
