// Desarrollo local: las peticiones /api se envían al backend (puerto 3000)
module.exports = {
  '/api': {
    target: 'http://localhost:3000',
    secure: false,
  },
};
