import { MockData } from '../../types/mock-type/mock-data.js';
import { getRandomItem, getRandomItems } from '../../utils/random.js';
import { FilmGeneratorInterface } from './film-generator.interface.js';

class FilmGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const name =  getRandomItem<string>(this.mockData.name);
    const posterImage = getRandomItem<string>(this.mockData.posterImage);
    const backgroundImage = getRandomItem<string>(this.mockData.backgroundImage);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColor);
    const description = getRandomItem<string>(this.mockData.description);
    const rating = getRandomItem<number>(this.mockData.rating);
    const scoresCount = getRandomItem<number>(this.mockData.scoresCount);
    const director = getRandomItem<string>(this.mockData.director);
    const starring = getRandomItems<string>(this.mockData.starring).join(';');
    const runTime = getRandomItem<number>(this.mockData.runTime);
    const genre = getRandomItem<string>(this.mockData.genre);
    const released = getRandomItem<number>(this.mockData.released);
    const userName = getRandomItem<string>(this.mockData.userName);
    const email = getRandomItem<string>(this.mockData.email);
    const password = getRandomItem<string>(this.mockData.password);
    const avatar = (this.mockData.avatar && getRandomItem<string>(this.mockData.avatar)) ?? 'unknown.jpg';
    const publishDate = new Date().toISOString();
    const previewVideoLink = getRandomItem<string>(this.mockData.previewVideoLink);
    const videoLink = getRandomItem<string>(this.mockData.videoLink);

    return [
      name, posterImage,
      backgroundImage, backgroundColor, description, rating,
      scoresCount, director, starring, runTime, genre, released,
      userName, email, password, avatar, publishDate, previewVideoLink, videoLink
    ].join('\t');
  }
}

export default FilmGenerator;
