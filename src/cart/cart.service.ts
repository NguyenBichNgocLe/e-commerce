import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { Product } from 'src/products/entities/product.entity';
import { Item } from './entities/item.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
    ) {}

    async findOne(userId: number) {
        const cart = await this.userRepository.findOne({ 
            where: { id: userId },
            // relations: ['cart'],
        });
        if(!cart) throw new NotFoundException('Cart of the user not found');
        delete cart.password;
        delete cart.hashedRefreshToken;
        return cart;
    }

    async findAll() {
        return await this.cartRepository.find();
    }

    async addItem(userId: number, createItemDto: CreateItemDto) {
        const { productId } = createItemDto;

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if(!user) throw new NotFoundException('User not found');

        const product = await this.productRepository.findOne({
            where: { id: productId }
        });
        if(!product) throw new NotFoundException('Product not found');

        const newItem = await this.itemRepository.create({
            ...createItemDto,
            product: { id: productId },
            cart: { id: user.cart.id },
        });

        await this.itemRepository.save(newItem);
        await user.cart.items.push(newItem);

        return user.cart;
    }
}
