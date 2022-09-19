import { readFileSync } from 'fs';
import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';

class CommandVersion implements CliCommandInterface {
  public readonly name = '--version';

  private readVersion(): string {
    const contentPageJSON = readFileSync('./package.json', 'utf-8');
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public execute(): void {
    const version = this.readVersion();
    console.log(chalk.blue(version));
  }
}

export default CommandVersion;
