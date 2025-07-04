import { fastify } from "fastify";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import schemaCompilers from "./plugins/ajv.ts";


const build = (opts = {}) => {
  const app = fastify(opts);
  app.register(authRoutes);
  app.setValidatorCompiler(({ schema, httpPart }) => {
    return schemaCompilers[httpPart as keyof typeof schemaCompilers].compile(
      schema,
    );
  });
  return app;
};

export default build;
