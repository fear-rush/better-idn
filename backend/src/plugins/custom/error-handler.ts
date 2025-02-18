// error-handler.ts
import fp from "fastify-plugin";
import { AppError } from "../../utils/custom-error";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { FastifyError, FastifyRequest, FastifyReply } from "fastify";

export default fp(async (fastify) => {
  fastify.setErrorHandler((error: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
    // Handle AppError instances
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        message: error.message,
      });
    }

    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(400).send({
        message: error.message,
        // for debug purposes only
        // validationErrors: error.validation?.map((err) => ({
        //   path: err.instancePath,
        //   message: err.message,
        // })),
      });
    }

    // Handle invalid JSON format errors
    if (error.statusCode === 400 && error.code === 'FST_ERR_CTP_INVALID_MEDIA_TYPE') {
      return reply.code(400).send({
        message: "Invalid JSON format",
      });
    }

    // Handle other 400 errors (e.g., bad request)
    if (error.statusCode === 400) {
      return reply.code(400).send({
        message: error.message || "Bad Request",
      });
    }

    // For debugging purposes
    console.error("Unknown error occurred: ", error);

    // Handle all other errors as 500
    return reply.code(500).send({
      message: "Internal server error",
    });
  });
});