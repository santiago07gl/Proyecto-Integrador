import { createApp } from './app';
import { waitForDb } from './config/db';
import { seed } from './config/seed';

const port = Number(process.env.PORT) || 3000;

waitForDb()
  .then(seed)
  .then(() => createApp().listen(port, () => console.log(`kroni-api escuchando en el puerto ${port}`)))
  .catch(e => { console.error(e); process.exit(1); });
