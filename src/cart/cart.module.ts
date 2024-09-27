import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Item, User, Product])
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
