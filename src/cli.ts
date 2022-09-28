#!/usr/bin/env node

import 'reflect-metadata';
import CLIApplication from './app/cli-application.js';
import CommandHelp from './cli-commands/command-help.js';
import CommandImport from './cli-commands/command-import.js';
import CommandVersion from './cli-commands/command-version.js';
import GenerateCommand from './cli-commands/command-generate.js';

const myManager = new CLIApplication();
myManager.registerCommands([
  new CommandHelp,
  new CommandVersion,
  new CommandImport,
  new GenerateCommand
]);

myManager.processCommand(process.argv);
