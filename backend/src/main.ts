import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fs from "node:fs";
import path from "node:path";
import { userRoutes } from "./modules/auth/auth.router";
import { postRoutes } from "./modules/post/post.router";
import { checkDBConnection } from "./db";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { config } from "./config";
import { authenticate } from "./middleware/authenticate";
import errorHandler from "./plugins/custom/error-handler";

// TODO: cleanup the code and reorganize into plugin folder. external and custom (internal)

// TODO: WATCH THE LOGGER LEVEL
const server = fastify({
  logger: {
    level: "trace",
  },
}).withTypeProvider<ZodTypeProvider>();
const sessionKey = fs.readFileSync(path.join(__dirname, "../secret-key"));

server.register(function (app, _opts, done) {
  // TODO: this is for temporary config. ensure the CORS policy is secure
  app.addHook("onRequest", async (req, reply) => {
    reply.header("access-control-allow-origin", config.ALLOW_ORIGIN);
    reply.header("Access-Control-Allow-Credentials", true);
    reply.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, X-Requested-With, Content-Type, Accept, X-Slug, X-UID"
    );
    reply.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, POST, PUT, PATCH, GET, DELETE"
    );
    if (req.method === "OPTIONS") {
      reply.send();
    }
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setNotFoundHandler((req, reply) => {
    reply.status(404).send({
      status: "error",
      message: `Route ${req.method}:${req.url} not found`,
      error: "Not Found",
      statusCode: 404,
    });
    return;
  });

  app.decorate("authenticate", authenticate);

  // TODO: add CSRF token security mechanism
  app.register(import("@fastify/secure-session"), {
    // TODO: add salt
    key: sessionKey,
    sessionName: "session",
    cookieName: "session-cookie",
    logLevel: "debug",
    expiry: 24 * 60 * 60 * 7, // 7 Days
    // expiry: 10, // 10 Seconds (for debug only)
    cookie: {
      path: "/",
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
    },
  });

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "BetterIDN API",
        description: "API documentation for BetterIDN",
        version: "1.0.0",
      },
      servers: [],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            name: "session",
            in: "cookie",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(errorHandler);
  app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
  });
  app.register(userRoutes, { prefix: "/api/v1" });
  app.register(postRoutes, { prefix: "/api/v1" });

  done();
});

async function start() {
  try {
    await checkDBConnection();

    await server.listen({ port: config.SERVER_PORT, host: config.HOST });
    console.log(`Server listening on ${config.SERVER_PORT}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

start();

process.on("SIGINT", async () => {
  await server.close();
  console.log("Server shut down gracefully.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await server.close();
  console.log("Server shut down gracefully.");
  process.exit(0);
});
