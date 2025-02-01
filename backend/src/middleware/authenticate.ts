import { FastifyRequest, FastifyReply } from "fastify";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  // console.log(req.session.get("user")); // for debugging purposes
  console.log(req.session)
  if (!req.session.get("user")) {
    reply.code(401).send({
      message: "You are currently not logged in",
    });
  }
}
