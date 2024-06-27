import ConfigException from "./errors/config.exception";
import * as dotenv from "dotenv";

const options = process.env.ENV_FILE ? {path: process.env.ENV_FILE} : undefined;
dotenv.config(options);

export function getEnvironmentVariable(key: string, validator?: (value: string) => boolean): string {
    const value = process.env[key];
    if (!value) {
        throw new ConfigException(`Environment variable ${key} is not set`);
    }
    if (validator && !validator(value)) {
        throw new ConfigException(`Environment variable '${key}=${value}' did not pass validation`);
    }

    return value;
}