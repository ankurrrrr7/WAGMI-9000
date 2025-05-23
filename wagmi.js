require('dotenv').config();
const cluster = require('cluster');
const os = require('os');
const fastify = require('fastify');
const inputValidation = require('./type')
if (cluster.isMaster) {
  const cpuCount = os.cpus().length;
  console.log(`Master process running. Forking ${cpuCount} workers...`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });
} else {
  const app = fastify({ logger: true });
  app.post('/wagmi', async (request, reply) => {
    const recievedPayload = request.body || {};
    if (Object.keys(recievedPayload).length === 0) {
      return reply.status(200).send({
        message: "wagmi",
        timestamp: new Date().toISOString(),
        lang: "Node.js",
      });
    } else {
      const parsed = inputValidation.safeParse(recievedPayload)
        const sum = parsed.data.a + parsed.data.b;
        if(!parsed.success){
            return reply.send({
                error:"Invalid inputs"
            })
        }
        else if(sum>100){
           return reply.send({
                error:"Invalid inputs"
            })
        }else{
            return reply.send({
                result: sum,
                a: parsed.data.a,
                b: parsed.data.b,
                status: "success"
            })
        }
    }
  });
const PORT = process.env.PORT
  app.listen({ port:PORT }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`Worker ${process.pid} started at ${address}`);
  });
}