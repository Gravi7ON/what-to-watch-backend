import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component-types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-methods.enum.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { fillDTO } from '../../utils/common.js';
import FilmResponse from './response/film-response.js';
import CreateFilmDto from './dto/create-film.dto.js';

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.findAllFims();

    const filmResponse = fillDTO(FilmResponse, films);
    this.send(res, StatusCodes.OK, filmResponse);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response
  ): Promise<void> {
    const existFilm = await this.filmService.findByName(body.name);

    if (existFilm) {
      const errorMessage = `Film with name «${body.name}» exists.`;
      this.send(res, StatusCodes.UNPROCESSABLE_ENTITY, {error: errorMessage});
      return this.logger.error(errorMessage);
    }

    const result = await this.filmService.create(body);

    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(FilmResponse, result)
    );
  }
}
