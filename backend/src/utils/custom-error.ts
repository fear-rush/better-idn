export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.statusCode = statusCode;
    
    Error.captureStackTrace(this);
  }
}

// TODO: the error can be extended like this.

// import { AppError, ValidationError, DatabaseError } from './custom-errors'; // Import all custom error types
// import { FastifyReply } from 'fastify';

// export function handleError(error: unknown, reply: FastifyReply) {
//   if (error instanceof AppError) {
//     return reply.code(error.statusCode).send({
//       message: error.message,
//     });
//   }

//   if (error instanceof ValidationError) {
//     return reply.code(400).send({
//       message: error.message,
//       details: error.details, // Additional error details
//     });
//   }

//   if (error instanceof DatabaseError) {
//     return reply.code(503).send({
//       message: 'Database error occurred',
//     });
//   }

//   // Handle unknown errors
//   console.error('Unknown error occurred:', error);
//   return reply.code(500).send({
//     message: 'Internal server error',
//   });
// }