import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "../../users/model/user.entity";

@Entity({name: 'customers'})
export default class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 20})
    firstName: string;

    @Column({length: 30})
    lastName: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}