import {getEnvironmentVariable} from "./helpers";
import {isBooleanString} from "class-validator";

export default class Logger {
    private static IS_ENABLED = getEnvironmentVariable("LOGGING", isBooleanString) == "true";

    static log(message: string, ...args: string[]) {
        if (this.IS_ENABLED)
            console.log(`\x1b[36m[${new Date().toISOString()}]\x1b[0m ${message}`, ...args);
    }

    static error(message?: string, error?: any) {
        if (this.IS_ENABLED)
            console.error(`\x1b[31m[${new Date().toISOString()}]\x1b[0m`, message ?? "\b", error ?? "");
    }
}