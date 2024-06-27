import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import {JwtPayload} from "jsonwebtoken";
import HttpError from "./errors/http.error";
import {getEnvironmentVariable} from "./helpers";

export default class EncryptionService {
    private static JWT_SECRET = getEnvironmentVariable("JWT_SECRET");

    static async generateHash(plainText: string): Promise<string> {
        return bcrypt.hash(plainText, 10);
    }

    static async compareHash(plainText: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plainText, hash);
    }

    static generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.JWT_SECRET, {expiresIn: "2h"});
    }

    static validateToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
        } catch (error) {
            throw new HttpError("Unauthorized", 401, error);
        }
    }
}