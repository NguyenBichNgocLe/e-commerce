import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../utils/common/user-roles.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Roles,
        array: true,
        default: [Roles.USER]
    })
    roles: Roles[];
}
