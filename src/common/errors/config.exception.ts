import Logger from "../logger";

export default class ConfigException extends Error {
    constructor(message?: string, error?: any) {
        if (error) {
            Logger.error(undefined, error);
        }
        super(message);
    }
}