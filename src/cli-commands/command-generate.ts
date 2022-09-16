import got from 'got';
import chalk from 'chalk';
import FilmGenerator from '../common/film-generator/film-generator.js';
import { MockData } from '../types/mock-type/mock-data.js';
import { CliCommandInterface } from './cli-command.interface.js';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';

class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const filmCount = Number(count);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(`${chalk.red(`Can't fetch data from ${url}.`)}`);
    }

    const filmGeneratorString = new FilmGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < filmCount; i++) {
      await tsvFileWriter.write(filmGeneratorString.generate());
    }

    console.log(`${chalk.blue(`File ${filepath} was created!`)}`);
  }
}

export default  GenerateCommand;
