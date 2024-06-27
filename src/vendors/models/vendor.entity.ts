import {Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import User from "../../users/model/user.entity";

@Entity({name: 'vendors'})
export default class Vendor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 80, unique: true})
    businessName: string;

    @Column()
    businessDescription: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}