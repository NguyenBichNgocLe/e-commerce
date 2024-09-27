import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "src/products/entities/product.entity";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // name: string;

    @ManyToOne(() => Product, (product) => product.items)
    product: Product;

    // @Column("decimal", { precision: 10, scale: 2 })
    // price: number;

    @Column()
    quantity: number;

    // @Column("decimal", { precision: 10, scale: 2 })
    // subtotal: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;
}