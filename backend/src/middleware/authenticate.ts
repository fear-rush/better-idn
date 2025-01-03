import { FastifyRequest, FastifyReply } from "fastify";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  // console.log(req.session.get("user")); // for debugging purposes
  if (!req.session.get("user")) {
    reply.code(401).send({
      status: "error",
      statusCode: 401,
      error: "Unauthorized",
      message: "You are currently not logged in",
    });
  }
}
