import { Request, Response, NextFunction } from "express";
import { isCelebrate } from "celebrate";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status-codes";
import { AppError } from "../errors/app.error";
import { HttpError } from "../errors/http.error";
import { Logger } from "../shared/logger";
import { Translation } from "../shared/translation/translation";

export const errorHandler = ({ logger }: { logger: Logger }) => <T>(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction,
) => {
  logger.error(err.toString());

  if (isCelebrate(err)) {
    return res.status(BAD_REQUEST).json(err);
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: new Translation(err.message),
    });
  }

  if (err instanceof AppError) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: new Translation(err.message),
    });
  }

  return res.status(INTERNAL_SERVER_ERROR).json({
    message: new Translation("error.unknown"),
  });
};
