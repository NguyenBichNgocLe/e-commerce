import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/entities/cart.entity';
import { Item } from './cart/entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Password0.',
      database: 'my-db',
      synchronize: true,
      entities: [User, Product, Cart, Item]
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
