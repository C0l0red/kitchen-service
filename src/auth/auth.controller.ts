import {NextFunction, Request, Response} from "express";
import AuthService from "./auth.service";
import {
    CreateCustomerDto,
    CreateVendorDto,
    createCustomerDtoMapper,
    createVendorDtoMapper
} from "./dto/register.dto";
import LoginDto, {loginDtoMapper} from "./dto/login.dto";
import {responseDtoMapper} from "../common/dto/response.dto";
import {UserType} from "../users/model/user-type.enum";

export default class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    async registerCustomer(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: CreateCustomerDto = await createCustomerDtoMapper(request.body);
            await this.authService.register(dto, UserType.CUSTOMER);
            const responseData = responseDtoMapper("Customer registration successful");

            response.status(201).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async registerVendor(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: CreateVendorDto = await createVendorDtoMapper(request.body);
            await this.authService.register(dto, UserType.VENDOR);
            const responseData = responseDtoMapper("Vendor registration successful");

            response.status(201).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async login(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: LoginDto = await loginDtoMapper(request.body);
            const data = await this.authService.login(dto);
            const responseData = responseDtoMapper("Login successful", data);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}