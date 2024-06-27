import {Request, Response, NextFunction} from "express";
import Logger from "../common/logger";

export const requestLoggerMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    Logger.log(`${request.method} ${request.url}`);
    next();
};