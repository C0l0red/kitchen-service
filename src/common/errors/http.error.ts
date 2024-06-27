import Logger from "../logger";
import BaseError from "./base.error";

export default class HttpError extends BaseError {
    constructor(message: string, statusCode = 500, error?: any) {
        super(message, statusCode);
        Logger.error(undefined, error ?? this);
    }
}
