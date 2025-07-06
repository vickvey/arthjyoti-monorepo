import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/api-error";
import { apiResponse } from "@/utils/api-response";
import { DrizzleError } from "drizzle-orm";

export function errorHandler(
  err: ApiError | DrizzleError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError)
    res
      .status(err.statusCode || 500)
      .json(
        apiResponse(
          false,
          err.message || "Internal Server Error",
          null,
          err.stack
        )
      );
  if (err instanceof DrizzleError)
    res.status(400).json(apiResponse(false, err.message, null, err.stack));
}
