import {Repository} from "typeorm";
import User from "./users/model/user.entity";
import Vendor from "./vendors/models/vendor.entity";
import Customer from "./customers/models/customer.entity";
import MenuItem from "./menu-items/models/menu-item.entity";
import {Request, Response, NextFunction} from "express";

export {};

declare global {
    interface Extensible {
        [key: string]: any;
    }

    interface Dto<T> extends Partial<T>, Extensible {
    }

    type UsersRepository = Repository<User>;
    type VendorsRepository = Repository<Vendor>;
    type CustomersRepository = Repository<Customer>;
    type MenuItemsRepository = Repository<MenuItem>;
    type EntityListAndCount<T> = { entities: T[], count: number };
    type Middleware = (request: Request, response: Response, next: NextFunction) => void;
}