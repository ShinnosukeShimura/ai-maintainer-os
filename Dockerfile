FROM node:20-slim

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile=false
RUN pnpm build

CMD ["node", "apps/cli/dist/index.js", "--help"]
