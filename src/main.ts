import 'reflect-metadata';
import Application from './app/application.js';
import { Component } from './types/component-types.js';
import { applicationContainer } from './inversify.config.js';

const application = applicationContainer.get<Application>(Component.Application);
application.init();
