import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {UserType} from "./user-type.enum";

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
}