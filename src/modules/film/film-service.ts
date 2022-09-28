import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { FilmServiceInterface } from './film-service.interface.js';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmEntity } from './film-entity.js';
import { Component } from '../../types/component-types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';

@injectable()
class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.name}`);

    return result;
  }

  public async findByName(filmName: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({name: filmName}).exec();
  }

  public async findOrCreate(filmName: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const existedFilm = await this.findByName(filmName);

    if (existedFilm) {
      return existedFilm;
    }

    return this.create(dto);
  }
}

export default FilmService;
