import { NextFunction, Request, Response } from 'express';
import {inject, injectable} from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { Component } from '../../types/component-types.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import HttpError from './http-error.js';
import { createErrorObject } from '../../utils/common.js';
import { ServiceError } from '../../types/service-error.enum.js';
import ValidationError from './validation-error.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface
  ) {
    this.logger.info('Register ExceptionFilter');
  }

  private handleHttpError(error: HttpError, _next: NextFunction, _req: Request, res: Response) {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} — ${error.message}`);
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ServiceError.CommonError, error.message));
  }

  private handleOtherError(error: Error, _next: NextFunction, _req: Request, res: Response) {
    this.logger.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ServiceError.ServiceError, error.message));
  }

  private handleValidationError(error: ValidationError, _next: NextFunction, _req: Request, res: Response) {
    this.logger.error(`[Validation Error]: ${error.message}`);
    error.details.forEach(
      (errorField) => this.logger.error(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ServiceError.ValidationError, error.message, error.details));
  }

  public catch(error: Error | HttpError | ValidationError, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, next, req, res);
    } else if (error instanceof ValidationError) {
      return this.handleValidationError(error, next, req, res);
    }

    this.handleOtherError(error, next, req, res);
  }
}
