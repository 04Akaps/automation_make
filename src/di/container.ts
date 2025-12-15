import 'reflect-metadata';
import { container } from 'tsyringe';
import dotenv from 'dotenv';
import { registerInfrastructure } from './modules/InfrastructureModule';
import { registerApplication } from './modules/ApplicationModule';

dotenv.config();

registerInfrastructure(container);
registerApplication(container);

export { container };
