import {NextFunction, Request, Response} from "express";
import AuthService from "./auth.service";
import {
    RegisterCustomerDto,
    RegisterVendorDto,
    buildRegisterCustomerDto,
    buildRegisterVendorDto
} from "./dto/register.dto";
import LoginDto, {buildLoginDto} from "./dto/login.dto";
import {buildResponse} from "../common/dto/response.dto";
import {UserType} from "../users/model/user-type.enum";

export default class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    async registerCustomer(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: RegisterCustomerDto = await buildRegisterCustomerDto(request.body);
            await this.authService.register(dto, UserType.CUSTOMER);
            const responseData = buildResponse("Customer registration successful");

            response.status(201).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async registerVendor(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: RegisterVendorDto = await buildRegisterVendorDto(request.body);
            await this.authService.register(dto, UserType.VENDOR);
            const responseData = buildResponse("Vendor registration successful");

            response.status(201).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async login(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: LoginDto = await buildLoginDto(request.body);
            const data = await this.authService.login(dto);
            const responseData = buildResponse("Login successful", data);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}