# Kroni · Sistema de reservas

Aplicación web del Proyecto Integrador: **backend** en Node.js + Express + TypeScript (API REST organizada por módulos y capas), **frontend** en Angular 20 y base de datos **PostgreSQL**.

## Requisitos
- Node.js 22 o superior y npm
- PostgreSQL 16 (o Docker, que lo incluye)
- Opcional: Docker y Docker Compose

## Opción 1 · Todo con Docker (recomendada)

```bash
cp .env.example .env          # opcional: cambia las claves
docker compose up --build
```

| Servicio | URL |
|---|---|
| Aplicación web | http://localhost:8080 |
| API REST | http://localhost:3000/api (`/api/health` para comprobar) |
| PostgreSQL | localhost:5432 |

> Si ya habías levantado una versión anterior del proyecto, borra el volumen para que se creen las tablas nuevas: `docker compose down -v`.

## Opción 2 · Ejecución local (sin Docker para backend y frontend)

### 1. Base de datos
```bash
docker compose up db          # o usa tu PostgreSQL y ejecuta db/init.sql
```

### 2. Backend (puerto 3000)
```bash
cd backend
cp .env.example .env          # ajusta DATABASE_URL y JWT_SECRET si hace falta
npm install
npm run dev                   # compila y arranca  (producción: npm run build && npm start)
```
Al primer arranque el backend inserta datos de ejemplo (localización, usuarios, servicios, una reserva, un evento y un reporte).

### 3. Frontend (puerto 4200)
```bash
cd frontend
npm install
npm start                     # http://localhost:4200  (proxy.conf.js reenvía /api al backend en :3000)
```

## Cuentas de prueba
| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@kroni.com | admin123 |
| Agente | agent@kroni.com | agent123 |
| Cliente | client@kroni.com | client123 |

## Módulos del backend
| Módulo | Entidades | Endpoints base |
|---|---|---|
| Localización | Países, Departamentos, Ciudades | `/api/countries` · `/api/departments` · `/api/cities` |
| Auth | Inicio de sesión, Registro, Usuarios | `/api/auth/login` · `/api/auth/register` · `/api/users` |
| Clientes | Reservas | `/api/reservations` |
| Agentes | Eventos | `/api/events` |
| Administradores | Reportes, Servicios | `/api/reports` · `/api/services` (+ `/api/stats`) |

Cada entidad expone las cinco operaciones CRUD: `GET /` (GetAll), `GET /:id` (GetById), `POST /` (Create), `PUT /:id` (Update) y `DELETE /:id` (Delete).

Más detalle (estructura por capas, permisos por rol, pantallas) en [`DOCUMENTACION.md`](DOCUMENTACION.md).
