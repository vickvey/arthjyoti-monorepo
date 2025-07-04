import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/api-error";
import { apiResponse } from "@/utils/api-response";

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
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
}
