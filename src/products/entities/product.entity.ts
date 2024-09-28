import { Item } from "src/cart/entities/item.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @Column()
    category: string;

    @OneToMany(() => Item, (item) => item.product, {
        onDelete: 'CASCADE',
    })
    items: Item[];
}
