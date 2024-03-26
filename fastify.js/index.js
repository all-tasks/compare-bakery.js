import Fastify from 'fastify';

const api = Fastify();

api.get('/', async () => 'hello world');

api.listen({ port: 3400 });
