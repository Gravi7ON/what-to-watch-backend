#!/usr/bin/env node

import CLIApplication from './app/cli-application.js';
import CommandHelp from './cli-commands/command-help.js';
import CommandImport from './cli-commands/command-import.js';
import CommandVersion from './cli-commands/command-version.js';

const myManager = new CLIApplication();
myManager.registerCommands([
  new CommandHelp,
  new CommandVersion,
  new CommandImport
]);

myManager.processCommand(process.argv);
