import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Vendor from "../../vendors/models/vendor.entity";

@Entity({name: 'menu_items'})
export default class MenuItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 80})
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @ManyToOne(() => Vendor)
    vendor: Vendor;
}