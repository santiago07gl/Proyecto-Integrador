# EjemploAngular
# Spotvia

Aplicación Angular para descubrir y administrar espacios deportivos y actividades en Tuluá, Valle del Cauca. La información se presenta con datos mock en pesos colombianos (COP); esta entrega no utiliza backend, APIs ni persistencia.

## Requisitos

- Node.js compatible con Angular 22.
- npm.

## Instalación y ejecución

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200/`.

## Vistas y rutas

- `/client`: catálogo de eventos y resumen de reservas del cliente.
- `/client/reservations`: historial y estado de las reservas del cliente.
- `/login` y `/register`: pantallas de acceso y registro de demostración.
- `/agent`: resumen del agente.
- `/agent/events`: eventos publicados y formulario visual para registrar un evento.
- `/agent/reservations`: solicitudes y estado actual de las reservas.
- `/admin`: métricas, actividad mensual y reservas recientes.

La ruta raíz y las rutas desconocidas redirigen al catálogo. El login incluye enlaces de demostración para abrir cada perfil; no hay autenticación real.

## Datos mock

Los modelos están en `src/app/models/spotvia.models.ts` y los servicios inyectables en `src/app/services/`:

- `UserMockService`: perfiles de cliente, agente y administración.
- `EventMockService`: catálogo y eventos del agente.
- `ReservationMockService`: reservas por cliente y agente.
- `AdminReportMockService`: indicadores y actividad mensual.

Los botones de reserva y registro son visuales. No crean ni modifican información.

## Bootstrap

Se usan Bootstrap Grid, Reboot y Utilities, además de estilos locales para tablas, botones y formularios. Los archivos se integran desde `angular.json`.

## Comandos

```bash
npm run build
npm test -- --watch=false
```
```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
