import CustomersService from "./customers.service";
import {Request, Response, NextFunction} from "express";
import {CreateCustomerDto, createCustomerDtoMapper} from "./dto/create-customer.dto";
import {responseDtoMapper} from "../common/dto/response.dto";

export default class CustomersController {
    constructor(private readonly customersService: CustomersService) {
    }

    async createCustomer(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: CreateCustomerDto = await createCustomerDtoMapper(request.body);
            await this.customersService.createCustomer(dto);
            const responseData = responseDtoMapper("Customer created successful");

            response.status(201).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}