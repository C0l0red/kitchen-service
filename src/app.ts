import express, {Express, Router, Request, Response} from "express";
import {Server, createServer} from "node:http";
import {requestLoggerMiddleware} from "./middleware/logger.middleware";
import {
    errorHandlerMiddleware,
    errorLoggerMiddleware,
    invalidPathHandlerMiddleware
} from "./middleware/error-handlers.middleware";
import Logger from "./common/logger";
import {authorizationMiddleware} from "./middleware/authorization.middleware";
import * as bodyParser from "body-parser";
import createUsersModule from "./users";
import User from "./users/model/user.entity";
import createCustomersModule from "./customers";
import createAuthModule from "./auth";
import createVendorsModule from "./vendors";
import Vendor from "./vendors/models/vendor.entity";
import createMenuItemsModule from "./menu-items";
import MenuItem from "./menu-items/models/menu-item.entity";
import PermissionsMiddleware from "./middleware/permissions.middleware";
import {DatabaseManager} from "./data-source";
import {mapToresponseDto} from "./common/dto/response.dto";

const indexRouter = Router();

indexRouter.get("/", (request: Request, response: Response) => {
    const responseData = mapToresponseDto("API is live! Hit /docs to visit the Postman documentation");
    response.json(responseData);
})

indexRouter.get("/docs", (request: Request, response: Response) => {
    response.redirect("https://documenter.getpostman.com/view/11142088/2sA3dsnuKk");
});

export default class ExpressApp {
    private readonly app: Express;
    private readonly server: Server;

    constructor(private readonly databaseManager: DatabaseManager) {
        this.app = express();
        this.server = createServer(this.app);
    }

    getDataSource() {
        return this.databaseManager.getDataSource();
    }

    getApp() {
        return this.app;
    }

    startListening(port: number) {
        this.server.listen(port, () => {
            Logger.log(`Server Started. Listening on port ${port}`);
        })
    }

    stopListening() {
        this.server.close(() => {
            Logger.log("Server shutdown");
        });
    }

    private async initializeDatasource() {
        await this.databaseManager.initializeDatasource();
    }

    async destroyDatabase() {
        await this.databaseManager.destroyDatabase();
    }

    async initializeApp() {
        await this.initializeDatasource();
        const dataSource = this.getDataSource();

        const permissionsMiddleware = new PermissionsMiddleware(dataSource.getRepository(MenuItem));

        const usersModule = createUsersModule(dataSource.getRepository(User), authorizationMiddleware);
        const vendorsModule = createVendorsModule(dataSource, usersModule.usersService, authorizationMiddleware);
        const customersModule = createCustomersModule(dataSource, usersModule.usersService);
        const authModule = createAuthModule(usersModule.usersService);
        const menuItemsModule = createMenuItemsModule(
            dataSource.getRepository(MenuItem),
            permissionsMiddleware,
            authorizationMiddleware,
            vendorsModule.vendorsService
        );

        this.app.use(bodyParser.json());
        this.app.use(requestLoggerMiddleware);

        this.app.use(indexRouter);
        this.app.use('/auth', authModule.router);
        this.app.use('/users', usersModule.router);
        this.app.use('/vendors', vendorsModule.router);
        this.app.use('/customers', customersModule.router);
        this.app.use('/menu-items', menuItemsModule.router);

        this.app.use(errorLoggerMiddleware);
        this.app.use(errorHandlerMiddleware);
        this.app.use(invalidPathHandlerMiddleware);
    }
}