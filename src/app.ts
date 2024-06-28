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
import ConfigException from "./common/errors/config.exception";
import * as bodyParser from "body-parser";
import {DataSource} from "typeorm";
import createUsersModule from "./users";
import User from "./users/model/user.entity";
import createCustomersModule from "./customers";
import createAuthModule from "./auth";
import createVendorsModule from "./vendors";
import Vendor from "./vendors/models/vendor.entity";
import createMenuItemsModule from "./menu-items";
import MenuItem from "./menu-items/models/menu-item.entity";
import PermissionsMiddleware from "./middleware/permissions.middleware";

const indexRouter = Router();

indexRouter.get("/", (request: Request, response: Response) => {
    response.send("API is live! Hit /docs to visit the Postman documentation");
})

indexRouter.get("/docs", (request: Request, response: Response) => {
    response.redirect("https://documenter.getpostman.com/view/11142088/2sA3dsnuKk");
});

export default class ExpressApp {
    private readonly app: Express;
    private readonly server: Server;

    constructor(private readonly dataSource: DataSource) {
        this.app = express();
        this.server = createServer(this.app);
    }

    getDataSource() {
        if (!this.dataSource.isInitialized) {
            throw new ConfigException("Data Source is not initialized yet");
        }
        return this.dataSource;
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
        await this.dataSource.initialize()
            .then(() => {
                Logger.log("Datasource is connected");
            }).catch(error => {
                throw new ConfigException("Datasource failed to connect", error);
            })
    }

    async destroyDatabase() {
        await this.dataSource.dropDatabase();
        await this.dataSource.destroy();
    }

    async initializeApp() {
        await this.initializeDatasource();

        const permissionsMiddleware = new PermissionsMiddleware(this.dataSource.getRepository(Vendor));

        const usersModule = createUsersModule(this.dataSource.getRepository(User));
        const vendorsModule = createVendorsModule(this.dataSource);
        const customersModule = createCustomersModule(this.dataSource);
        const authModule = createAuthModule(
            usersModule.usersService,
            vendorsModule.vendorsService,
            customersModule.customersService
        );
        const menuItemsModule = createMenuItemsModule(
            this.dataSource.getRepository(MenuItem),
            permissionsMiddleware,
            vendorsModule.vendorsService
        );

        this.app.use(bodyParser.json());
        this.app.use(requestLoggerMiddleware);
        this.app.use(authorizationMiddleware);

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