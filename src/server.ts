import 'reflect-metadata';
import dotenv from 'dotenv';
import './di/container';
import { createApp } from './presentation';

dotenv.config();

const app = createApp();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Newsletter Server                    ║
║   Port: ${port}                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}          ║
╚════════════════════════════════════════╝
  `);
});

export default app;
