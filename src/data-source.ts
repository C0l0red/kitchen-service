import User from "./users/model/user.entity";
import {DataSource, EntityTarget, ObjectLiteral} from "typeorm";
import {getEnvironmentVariable} from "./common/helpers";
import {isBooleanString, isNumberString} from "class-validator";
import Vendor from "./vendors/models/vendor.entity";
import Customer from "./customers/models/customer.entity";
import MenuItem from "./menu-items/models/menu-item.entity";
import Logger from "./common/logger";
import ConfigException from "./common/errors/config.exception";


export const AppDataSource = new DataSource({
    type: "postgres",
    host: getEnvironmentVariable("DATABASE_HOST"),
    port: parseInt(getEnvironmentVariable("DATABASE_PORT", isNumberString)),
    username: getEnvironmentVariable("DATABASE_USERNAME"),
    password: getEnvironmentVariable("DATABASE_PASSWORD"),
    database: getEnvironmentVariable("DATABASE_NAME"),
    synchronize: true,
    logging: getEnvironmentVariable("DATABASE_LOGGING", isBooleanString) == "true",
    entities: [User, Vendor, Customer, MenuItem],
    subscribers: [],
    migrations: [],
});

export const SqliteDataSource = new DataSource({
    type: "better-sqlite3",
    database: "logistics_db.sqlite",
    synchronize: true,
    dropSchema: true,
    logging: true,
    entities: [User, Vendor, Customer, MenuItem],
});

export class DatabaseManager {
    constructor(private readonly dataSource: DataSource) {
    }

    async initializeDatasource() {
        await this.dataSource.initialize()
            .then(() => {
                Logger.log("Datasource is connected");
            }).catch(error => {
                throw new ConfigException("Datasource failed to connect", error);
            });
    }

    async destroyDatabase() {
        await this.dataSource.dropDatabase();
        await this.dataSource.destroy();
    }

    getDataSource() {
        if (!this.dataSource.isInitialized) {
            throw new ConfigException("Data Source is not initialized yet");
        }
        return this.dataSource;
    }

    getRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>) {
        return this.dataSource.getRepository(entity);
    }
}
