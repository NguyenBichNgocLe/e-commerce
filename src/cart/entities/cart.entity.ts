import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.cart)
    user: User;

    @OneToMany(() => Item, (item) => item.cart, {
        eager: true,
        onDelete: 'CASCADE',
        cascade: true,
    })
    items: Item[];

    @Column("decimal", { precision: 10, scale: 2 })
    total: number;
}