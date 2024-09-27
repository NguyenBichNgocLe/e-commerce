import { Role } from "src/auth/enums/role.enum";
import { Cart } from "src/cart/entities/cart.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Cart, (cart) => cart.user, {
        eager: true,
        onDelete: 'CASCADE',
        cascade: true,
    })
    @JoinColumn()
    cart: Cart;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.USER
    })
    role: Role;

    @Column({ nullable: true })
    hashedRefreshToken: string;
}
