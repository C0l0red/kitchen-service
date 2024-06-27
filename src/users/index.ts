import UsersService from "./users.service";
import UsersController from "./users.controller";
import {Router} from "express";

const createUsersModule = (usersRepository: UsersRepository) => {
    const usersService = new UsersService(usersRepository);
    const usersController = new UsersController(usersService);

    const router = Router();

    router.get('/me', usersController.getProfile.bind(usersController));

    return {
        router,
        usersService
    }
}

export default createUsersModule;