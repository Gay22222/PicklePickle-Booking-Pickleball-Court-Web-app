import app from './app/app.js';
const port = process.env.PORT || 4000;
app.listen({ port, host: '0.0.0.0' });