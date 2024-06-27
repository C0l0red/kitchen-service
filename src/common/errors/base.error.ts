export default class BaseError extends Error {
    message: string;
    statusCode: number;
    timestamp: number;
    path?: string;

    constructor(message: string, statusCode: number) {
        super();

        this.message = message;
        this.statusCode = statusCode;
        this.timestamp = Date.now();
    }
}