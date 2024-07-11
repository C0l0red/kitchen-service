import {Router} from "express";
import AuthService from "./auth.service";
import AuthController from "./auth.controller";
import UsersService from "../users/users.service";

const createAuthModule = (usersService: UsersService) => {
    const authService = new AuthService(usersService);
    const authController = new AuthController(authService);

    const router = Router();

    router.post('/login', authController.login.bind(authController));

    return {
        router
    }
};

export default createAuthModule;