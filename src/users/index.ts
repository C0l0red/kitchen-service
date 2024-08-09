import UsersService from "./users.service";
import UsersController from "./users.controller";
import {Router} from "express";

const createUsersModule = (usersRepository: UsersRepository, authorizationMiddleware: Middleware) => {
    const usersService = new UsersService(usersRepository);
    const usersController = new UsersController(usersService);

    const router = Router();

    router.get('', authorizationMiddleware, usersController.getProfile.bind(usersController));

    return {
        router,
        usersService
    }
}

export default createUsersModule;