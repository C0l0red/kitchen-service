import {Request, Response, NextFunction} from "express";
import HttpError from "../common/errors/http.error";
import EncryptionService from "../common/encryption.service";
import AuthenticatedRequest from "../common/interfaces/authenticated-request";
import Auth from "../auth";


export const authorizationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const authHeader = request.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        if (token) {
            const jwtPayload = EncryptionService.validateToken(token);

            (request as AuthenticatedRequest).email = jwtPayload.sub!;
            (request as AuthenticatedRequest).userId = jwtPayload.id;
            (request as AuthenticatedRequest).userType = jwtPayload.userType;
            (request as AuthenticatedRequest).vendorId = jwtPayload.vendorId;

            next();
            return;
        }
    }
    throw new HttpError("Unauthorized", 401);
}