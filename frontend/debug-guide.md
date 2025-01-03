
## Leasot TODO debugging
1. npm install -g pnpm
2. pnpm install --global leasot
3. pnpm run debug

## Spin up local dev server using docker
1. npx @fastify/secure-session > secret-key (to generate session secret key)
2. export NODE_ENV=development
3. pnpm dev:docker:up
4. pnpm db:studio
5. open browser then type local.drizzle.studio
6. pnpm dev:docker:down (stop local dev docker)

don't forget to set node env
- local: export NODE_ENV=development
- production: export NODE_ENV=production

