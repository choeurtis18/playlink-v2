FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

COPY packages/shared ./packages/shared
COPY packages/api ./packages/api

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @playlink/shared run build
RUN pnpm --filter @playlink/api run build

EXPOSE 3002

CMD ["node", "packages/api/dist/server.js"]
