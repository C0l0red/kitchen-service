import {ValidationError} from "class-validator";
import BaseError from "./base.error";
import Logger from "../logger";

export default class RequestValidationError extends BaseError {
    errors: string[];

    constructor(validationErrors: ValidationError[]) {
        const message = 'Invalid request data';
        const errorMessages: string[] = validationErrors
            .map(validationError => validationError.constraints)
            .map(constraints => Object.values(constraints!))
            .flat();

        Logger.error('ValidationError:', errorMessages);
        super(message, 400);

        this.errors = errorMessages;
    }
}
