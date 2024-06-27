import CustomersService from "./customers.service";
import {Router} from "express";
import {DataSource} from "typeorm";

const createCustomersModule = (dataSource: DataSource) => {
    const customersService = new CustomersService(dataSource);

    const router = Router();

    return {
        router,
        customersService
    }
};

export default createCustomersModule;