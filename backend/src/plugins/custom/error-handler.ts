import fp from "fastify-plugin";
import { AppError } from "../../utils/custom-error";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

// TODO: add logger
export default fp(async (fastify) => {
  fastify.setErrorHandler((error, req, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        message: error.message,
      });
    }

    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(400).send({
        message: error.message,
        validationErrors: error.validation?.map((err) => ({
          path: err.instancePath,
          message: err.message,
        })),
      });
    }

    // For debugging purposes
    // console.error("Unknown error occured: ", error);

    return reply.code(500).send({
      message: "Internal server error",
    });
  });
});
