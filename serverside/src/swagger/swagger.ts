

import type{ Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My App API Docs",
      version: "1.0.0",
      description: "Interactive API documentation",
    },
    servers: [
      {
        url: "http://localhost:8080", // ✅ change in prod
      },
    ],
  },
 apis: ["./src/swagger/swagger.docs.ts"], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerDocs = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
