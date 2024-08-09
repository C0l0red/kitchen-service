import {NextFunction, Request, Response} from "express";
import UsersService from "./users.service";
import AuthenticatedRequest from "../common/interfaces/authenticated-request";
import {mapToresponseDto} from "../common/dto/response.dto";
import {mapTouserDto} from "./dto/user.dto";

export default class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    async getProfile(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = (request as AuthenticatedRequest).userId;
            const user = await this.usersService.getProfile(userId);
            const responseData = mapToresponseDto("Current authenticated User Profile fetched", user, mapTouserDto);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}