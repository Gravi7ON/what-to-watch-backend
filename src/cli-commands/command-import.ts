import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';
import { createFilm, getErrorMessage } from '../utils/common.js';

class CommandImport implements CliCommandInterface {
  public readonly name = '--import';

  private onLine(line: string) {
    const film = createFilm(line);
    console.log(chalk.magenta(film));
  }

  private onComplete(count: number) {
    console.log(`${chalk.green(`${count} rows imported.`)}`);
  }

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('lineDone', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch(err) {
      console.log(`${chalk.red(`Can't read the file: ${getErrorMessage(err)}`)}`);
    }
  }
}

export default CommandImport;
