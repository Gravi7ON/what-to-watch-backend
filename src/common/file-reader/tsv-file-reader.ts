import { readFileSync } from 'fs';
import { GenreTypes } from '../../types/film-genres.enum.js';
import { Film } from '../../types/film.js';
import { FileReaderInterface } from './file-reader.interface.js';

type TypesGenre =  'Comedy' | 'Crime' | 'Documentary' |
  'Drama' | 'Horror' | 'Family' |
  'Romance' |'SciFi' |'Thriller';

class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, 'utf-8');
  }

  public toArray(): Film[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
        name,
        posterImage,
        backgroundImage,
        backgroundColor,
        description,
        rating,
        scoresCount,
        director,
        starring,
        runTime,
        genre,
        released,
        userName,
        email,
        password,
        publishDate,
        previewVideoLink,
        videoLink,
      ]) => ({
        name,
        description,
        posterImage,
        backgroundImage,
        backgroundColor,
        publishDate: new Date(publishDate),
        rating: Number.parseFloat(rating),
        scoresCount: Number.parseInt(scoresCount, 10),
        director,
        starring: starring.split(';').map((actorName) => actorName),
        runTime: Number.parseInt(runTime, 10),
        genre: GenreTypes[genre as TypesGenre],
        released: Number.parseInt(released, 10),
        user: {
          userName,
          email,
          password
        },
        previewVideoLink,
        videoLink
      }));
  }
}

export default TSVFileReader;
