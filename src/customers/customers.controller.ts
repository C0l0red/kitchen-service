import CustomersService from "./customers.service";
import {Request, Response, NextFunction} from "express";
import {CreateCustomerDto, mapToCreateCustomerDto} from "./dto/create-customer.dto";
import {mapToresponseDto} from "../common/dto/response.dto";
import {mapToCustomerDto} from "./dto/customer.dto";

export default class CustomersController {
    constructor(private readonly customersService: CustomersService) {
    }

    async createCustomer(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: CreateCustomerDto = await mapToCreateCustomerDto(request.body);
            const customer = await this.customersService.createCustomer(dto);
            const responseData = mapToresponseDto("Customer created successful", customer, mapToCustomerDto);

            response.status(201).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}