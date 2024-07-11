import {NextFunction, Request, Response} from "express";
import AuthService from "./auth.service";
import LoginDto, {mapToLoginDto} from "./dto/login.dto";
import {mapToresponseDto} from "../common/dto/response.dto";

export default class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    async login(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: LoginDto = await mapToLoginDto(request.body);
            const data = await this.authService.login(dto);
            const responseData = mapToresponseDto("Login successful", data);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}