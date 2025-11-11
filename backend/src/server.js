import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fastify = Fastify({ logger: true });

// nạp plugins & routes
fastify.register(autoload, { dir: join(__dirname, '../plugins') });
fastify.register(autoload, { dir: join(__dirname, '../routes') });

// health check
fastify.get('/health', async () => ({ ok: true, ts: Date.now() }));

const port = process.env.PORT || 4000;
fastify.listen({ host: '0.0.0.0', port });
