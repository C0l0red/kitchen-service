import {NextFunction, Request, Response} from "express";
import UsersService from "./users.service";
import AuthenticatedRequest from "../common/interfaces/authenticated-request";
import {buildResponse} from "../common/dto/response.dto";

export default class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    async getProfile(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = (request as AuthenticatedRequest).userId;
            const data = await this.usersService.getProfile(userId);
            const responseData = buildResponse("Current authenticated User Profile fetched", data);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}