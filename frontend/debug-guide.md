
## Leasot TODO debugging
1. npm install -g pnpm
2. pnpm install --global leasot
3. pnpm run debug

## Spin up local dev server using docker
1. cd backend
2. npx @fastify/secure-session > secret-key (to generate session secret key)
3. export NODE_ENV=development
4. pnpm dev:docker:up
5. pnpm db:studio
6. open browser then type local.drizzle.studio
7. pnpm dev:docker:down (stop local dev docker)

don't forget to set node env
- local: export NODE_ENV=development
- production: export NODE_ENV=production

