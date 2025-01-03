import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fs from "node:fs";
import path from "node:path";
import { userRoutes } from "./modules/user/user.router";
import { checkDBConnection } from "./db";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { config } from "./config";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { authenticate } from "./middleware/authenticate";

const server = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
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

  app.setErrorHandler((error, _, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      reply.code(400).send({
        status: "error",
        statusCode: 400,
        error: "Bad Request",
        message: error.message,
      });
      return;
    }
    reply.code(error.statusCode || 500).send({
      status: "error",
      statusCode: error.statusCode || 500,
      error: error.name ?? "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error occured",
    });
  });

  app.decorate("authenticate", authenticate);

  app.register(import("@fastify/secure-session"), {
    key: sessionKey,
    sessionName: "session",
    cookieName: "session-cookie",
    expiry: 24 * 60 * 60 * 7, // 7 Days
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

  app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
  });
  app.register(userRoutes, { prefix: "/api/v1" });

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
