import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ArthJyoti API Docs",
      version: "1.0.0",
      description: "API documentation for arthjyoti backend",
    },
    servers: [{ url: `http://localhost:5500/api` }],
  },
  apis: ["./src/routes/*.ts", "./src/bootstrap.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
