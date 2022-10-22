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
import HttpError from '../../common/error/http-error.js';
import { DEFAULT_FILMS_COUNT } from './film-constant.js';
import { getRandomPositiveInteger } from '../../utils/random.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.js';

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getAllFilms});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.createFilm,
      middlewares: [new ValidateDtoMiddleware(CreateFilmDto)]
    });
    this.addRoute({path: '/favorite', method: HttpMethod.Get, handler: this.getFavoriteFilms});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.getPromoFilm});
    this.addRoute({
      path: '/favorite/:filmId/:status',
      method: HttpMethod.Post,
      handler: this.changeFavoriteFilm,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Get,
      handler: this.getFilm,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Put,
      handler: this.editFilm,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new ValidateDtoMiddleware(CreateFilmDto),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Delete,
      handler: this.deleteFilm,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId/similar',
      method: HttpMethod.Get,
      handler: this.getSimilarFilms,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
  }

  public async getPromoFilm(_req: Request, res: Response): Promise<void> {
    const promoFilms = await this.filmService.findAllFims(DEFAULT_FILMS_COUNT);

    if (!promoFilms) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Can\'t find promo film',
        'FilmController'
      );
    }

    this.ok(
      res,
      fillDTO(FilmResponse, promoFilms[getRandomPositiveInteger(0, promoFilms.length - 1)])
    );
  }

  public async changeFavoriteFilm(req: Request, res: Response): Promise<void> {
    const statusFilm = req.params.status;
    const changedFilm = await this.filmService
      .changeStatusFavoriteFilms(req.params.filmId, Number(statusFilm));

    this.logger.info('The film was changed status');

    this.ok(
      res,
      fillDTO(FilmResponse, changedFilm)
    );
  }

  public async getFavoriteFilms(_req: Request, res: Response): Promise<void> {
    const favoriteFilms = await this.filmService.findFavoriteFilms();

    if (!favoriteFilms) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Favorite films don\'t add yet.',
        'FilmController'
      );
    }

    this.ok(
      res,
      fillDTO(FilmResponse, favoriteFilms)
    );
  }

  public async getSimilarFilms(req: Request, res: Response): Promise<void> {
    const similarFilms = await this.filmService
      .findSimilarFilmsByGenre(req.params.filmId, Number(req.query.limit) || DEFAULT_FILMS_COUNT);

    this.ok(
      res,
      fillDTO(FilmResponse, similarFilms)
    );
  }

  public async deleteFilm(req: Request, res: Response): Promise<void> {
    const film = await this.filmService.deleteById(req.params.filmId);

    this.logger.info('The film was deleted');

    this.noContent(
      res,
      fillDTO(FilmResponse, film)
    );
  }

  public async editFilm(req: Request, res: Response): Promise<void> {
    const film = await this.filmService.updateById(req.params.filmId, req.body);

    this.logger.info('The film was updated');

    this.ok(
      res,
      fillDTO(FilmResponse, film)
    );
  }

  public async getFilm(req: Request, res: Response): Promise<void> {
    const film = await this.filmService.findById(req.params.filmId);

    this.ok(
      res,
      fillDTO(FilmResponse, film)
    );
  }

  public async getAllFilms(req: Request, res: Response): Promise<void> {
    const films = await this.filmService.findAllFims(Number(req.query.limit) || DEFAULT_FILMS_COUNT);

    this.ok(
      res,
      fillDTO(FilmResponse, films)
    );
  }

  public async createFilm(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response
  ): Promise<void> {
    const existsFilm = await this.filmService.findByName(body.name);

    if (existsFilm) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film with name «${body.name}» exists.`,
        'FilmController'
      );
    }

    const result = await this.filmService.create(body);

    this.created(
      res,
      fillDTO(FilmResponse, result)
    );
  }
}
