import {Repository} from "typeorm";
import User from "./users/model/user.entity";
import Vendor from "./vendors/models/vendor.entity";
import Customer from "./customers/models/customer.entity";
import MenuItem from "./menu-items/models/menu-item.entity";

export {};

declare global {
    type Dto<T> = Partial<T>;
    type UsersRepository = Repository<User>;
    type VendorsRepository = Repository<Vendor>;
    type CustomersRepository = Repository<Customer>;
    type MenuItemsRepository = Repository<MenuItem>;
    type DtoListAndCount<T> = { entities: Dto<T>[], count: number };
    type EntitiesAndCount<T> = {entities: T[], count: number};
}