import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

import { Request, Response } from 'express';

import { EntityNotFoundError } from 'typeorm';

@Catch()
class InternalServerExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const request = ctx.getRequest<Request>();

    const status = exception.status || 500;

    response.status(status).json({
      statusCode: status,

      timestamp: new Date().toISOString(),

      path: request.url,

      message: exception.message,
    });
  }
}

@Catch(EntityNotFoundError)
class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const request = ctx.getRequest<Request>();

    const status = 404;

    response.status(status).json({
      statusCode: status,

      timestamp: new Date().toISOString(),

      path: request.url,

      message: exception.message,
    });
  }
}

export { InternalServerExceptionFilter, NotFoundExceptionFilter };
