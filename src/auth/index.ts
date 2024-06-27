import {Router} from "express";
import AuthService from "./auth.service";
import AuthController from "./auth.controller";
import UsersService from "../users/users.service";
import CustomersService from "../customers/customers.service";
import VendorsService from "../vendors/vendors.service";

const createAuthModule = (usersService: UsersService, vendorsService: VendorsService, customersService: CustomersService) => {
    const authService = new AuthService(usersService, vendorsService, customersService);
    const authController = new AuthController(authService);

    const router = Router();

    router.post('/login', authController.login.bind(authController));
    router.post('/register-customer', authController.registerCustomer.bind(authController));
    router.post('/register-vendor', authController.registerVendor.bind(authController));

    return {
        router
    }
};

export default createAuthModule;