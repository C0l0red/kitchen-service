import CustomersService from "./customers.service";
import {Router} from "express";
import {DataSource} from "typeorm";
import CustomersController from "./customers.controller";
import UsersService from "../users/users.service";

const createCustomersModule = (dataSource: DataSource, usersService: UsersService) => {
    const customersService = new CustomersService(dataSource, usersService);
    const customersController = new CustomersController(customersService);

    const router = Router();

    router.post('', customersController.createCustomer.bind(customersController));

    return {
        router,
        customersService
    }
};

export default createCustomersModule;