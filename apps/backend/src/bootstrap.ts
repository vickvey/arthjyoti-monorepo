import express, { Express, Request, Response } from "express";
import cors from "cors";
import { apiResponse } from "@/utils/api-response";
import { errorHandler } from "@/middlewares/error-handler";
import morganMiddleware from "./middlewares/morgan-middleware";
import authRouter from "@/routes/auth-routes";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./swagger";

function setMiddlewares(app: Express) {
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morganMiddleware);
}

function setRoutes(app: Express) {
  // Health Check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json(apiResponse(true, "ok"));
  });

  // Public Route
  app.use("/api/v1/auth", authRouter);

  // Protected Access: Admin Only
  // app.use('/api/v1/admin', authorize, isAdmin, adminRouter);

  // Protected Access: Admin and User
  // app.use('/api/v1/user', authorize, userRouter);
  // app.use('/api/v1/category', authorize, categoryRouter);
  // app.use('/api/v1/transaction', authorize, transactionRouter);

  app.all("/*splat", (_req: Request, res: Response) => {
    res.status(404).json(apiResponse(false, "Route doesn't exist"));
  });
}

// Factory function to create app
function createApp(): Express {
  // Create the app instance
  const app = express();

  // Glue necessary middleware
  setMiddlewares(app);

  // Setup Swagger API Docs
  setupSwagger(app);

  // Glue custom routes
  setRoutes(app);

  // Global error handler
  app.use(errorHandler);

  return app;
}

export { createApp };
