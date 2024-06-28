import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserType} from "./user-type.enum";
import Vendor from "../../vendors/models/vendor.entity";
import Customer from "../../customers/models/customer.entity";

@Entity({name: 'users'})
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 25, unique: true})
    email: string;

    @Column({length: 60, select: false})
    password: string;

    @Column({length: 20})
    phoneNumber: string;

    @Column({enum: UserType})
    userType: UserType;

    @OneToOne(() => Vendor, (vendor) => vendor.user)
    vendor?: Vendor;

    @OneToOne(() => Customer, (customer) => customer.user)
    customer?: Customer;
}