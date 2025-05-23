require('dotenv').config();
const fastify = require('fastify');
const inputValidation = require('./type');

const app = fastify({ logger: true });

app.addHook('onRequest', async (request, reply) => {
  console.log(`Incoming request: method=${request.method}, url=${request.url}`);
});

app.post('/wagmi', async (request, reply) => {
  const receivedPayload = request.body || {};

  if (Object.keys(receivedPayload).length === 0) {
    return reply.status(200).send({
      message: "wagmi",
      timestamp: new Date().toISOString(),
      lang: "Node.js",
    });
  }

  const parsed = inputValidation.safeParse(receivedPayload);

  if (!parsed.success) {
    return reply.status(400).send({ error: "Validation failed: a and b must be numbers >= 0" });
  }

  const { a, b } = parsed.data;
  const sum = a + b;

  if (sum > 100) {
    return reply.status(400).send({ error: "Sum of a and b must not exceed 100" });
  }

  return reply.status(200).send({
    result: sum,
    a:a,
    b:b,
    status: "success"
  });
});

const PORT = process.env.PORT || 3000;
app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server started at ${address}`);
});
