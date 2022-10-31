import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component-types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-methods.enum.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { fillDTO } from '../../utils/common.js';
import CommentResponse from './response/comment-response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.js';
import { ConfigInterface } from '../../common/config/config.interface.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for CommentController...');

    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Post,
      handler: this.createCommentToFilm,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.commentService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Get,
      handler: this.getCommentsByFilm,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.commentService, 'Film', 'filmId')
      ]
    });
  }

  public async createCommentToFilm(req: Request, res: Response): Promise<void> {
    const filmId = req.params.filmId;
    const result = await this.commentService.findFilmAndCreateComment(filmId, {
      ...req.body,
      userId: req.user.id
    });

    this.logger.info(`New comment for film with id:${filmId} was created`);

    this.created(
      res,
      fillDTO(CommentResponse, result)
    );
  }

  public async getCommentsByFilm(req: Request, res: Response): Promise<void> {
    const filmId = req.params.filmId;
    const result = await this.commentService.findById(filmId);

    this.ok(
      res,
      fillDTO(CommentResponse, result)
    );
  }
}
