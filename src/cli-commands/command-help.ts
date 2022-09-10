import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';

class CommandHelp implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        ${chalk.blue('Программа для подготовки данных для REST API сервера.')}
        ${chalk.red(`Пример:
            main.js --<command> [--arguments]`)}
        ${chalk.yellow('Команды:')}
            ${chalk.bgCyan('--version:')}                   ${chalk.white('# выводит номер версии')}
            ${chalk.bgGreen('--help:')}                      ${chalk.white('# печатает этот текст')}
            ${chalk.bgMagenta('--import <path>:')}             ${chalk.white('# импортирует данные из TSV')}
            ${chalk.bgRedBright('--generator <n> <path> <url>')} ${chalk.white('# генерирует произвольное количество тестовых данных')}
        `);
  }
}

export default CommandHelp;
