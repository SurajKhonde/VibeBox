import type { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VibeBox",
      version: "1.0.0",
      description: "VibeBox API swagger",
    },
    servers: [
      {
        url: "http://localhost:8080", // change in prod
      },
    ],
  },
  apis: ["./src/swagger/swagger.docs.ts"], // paths to your JSDoc annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerDocs = (app: Application) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        withCredentials: true,
      },
    })
  );
};
