FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat build-base
RUN npm install -g pnpm

CMD ["pnpm", "dev"]