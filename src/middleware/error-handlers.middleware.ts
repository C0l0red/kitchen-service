import {NextFunction, Request, Response} from 'express';
import HttpError from '../common/errors/http.error';
import Logger from "../common/logger";
import BaseError from "../common/errors/base.error";


export const errorLoggerMiddleware = (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    if (!(error instanceof BaseError)) {
        Logger.error(undefined, error);
        next(new HttpError("Something went wrong"));
    } else {
        next(error);
    }
};

export const errorHandlerMiddleware = (
    error: HttpError,
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    response.header('Content-Type', 'application/json');

    error.path = request.url;
    response.status(error.statusCode || 500).send(JSON.stringify(error, null, 4)); // pretty print
};

export const invalidPathHandlerMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    const notFoundError = new HttpError("Path Not Found", 404);
    notFoundError.path = request.path;

    response.status(404).json(notFoundError);
};