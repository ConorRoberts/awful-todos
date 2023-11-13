import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { fileURLToPath } from "node:url";
import { handler as ssrHandler } from "./dist/server/entry.mjs";

const main = async () => {
  const app = Fastify({ logger: true });

  await app
    .register(fastifyStatic, {
      root: fileURLToPath(new URL("./dist/client", import.meta.url)),
    })
    .register(fastifyMiddie);
  app.use(ssrHandler);

  app.listen({ port: 8080, host: "0.0.0.0" });
};

main();
