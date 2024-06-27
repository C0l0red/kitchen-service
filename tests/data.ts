import {DataSource} from "typeorm";
import Vendor from "../src/vendors/models/vendor.entity";
import Customer from "../src/customers/models/customer.entity";
import MenuItem from "../src/menu-items/models/menu-item.entity";
import User from "../src/users/model/user.entity";
import {UserType} from "../src/users/model/user-type.enum";

export const dataSource = new DataSource({
    type: "better-sqlite3",
    database: "logistics_db.sql",
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [User, Vendor, Customer, MenuItem],
});

export const testUser1: User = {
    id: 1,
    email: "john@test.com",
    password: "$2b$10$ydIjgXRTX1CI/5OEhym8AeK31qChRYD0T9rOJ3rfDmWxOZEz1mJkq",
    phoneNumber: "08123456789",
    userType: UserType.CUSTOMER,
}

export const testUser2: User = {
    id: 2,
    email: "david@test.com",
    password: "$2b$10$ydIjgXRTX1CI/5OEhym8AeK31qChRYD0T9rOJ3rfDmWxOZEz1mJkq",
    phoneNumber: "08123456789",
    userType: UserType.VENDOR,
}

export const testUser3: User = {
    id: 3,
    email: "mike@test.com",
    password: "$2b$10$ydIjgXRTX1CI/5OEhym8AeK31qChRYD0T9rOJ3rfDmWxOZEz1mJkq",
    phoneNumber: "08123456789",
    userType: UserType.CUSTOMER,
}