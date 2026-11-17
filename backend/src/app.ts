import cors from 'cors';
import express from 'express';
import { errorHandler, notFound } from './middlewares/error-handler';
import administradores from './modules/administradores';
import agentes from './modules/agentes';
import authModule from './modules/auth';
import clientes from './modules/clientes';
import localizacion from './modules/localizacion';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => { res.json({ ok: true, api: 'kroni-api' }); });

  // Un router por módulo
  app.use('/api', localizacion);
  app.use('/api', authModule);
  app.use('/api', clientes);
  app.use('/api', agentes);
  app.use('/api', administradores);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
