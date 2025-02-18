import "@fastify/secure-session";
import "fastify";
import { findUserById } from "../modules/auth/auth.service";
import { authenticate } from "../middleware/authenticate";

// for setting cookies. so the server can set the session. e.g: req.session.set("user")
declare module "@fastify/secure-session" {
  interface SessionData {
    user: {
      id: string;
      username: string;
    };
  }
}

declare module "fastify" {
  // for getting current user state in getCurrentUserHandler
  // TODO: check this output, so the output only id and username
  interface FastifyRequest {
    user: Awaited<ReturnType<typeof findUserById>> | null;
  }

  // preHandler authenticate middleware
  interface FastifyInstance {
    authenticate: typeof authenticate
  }
}
