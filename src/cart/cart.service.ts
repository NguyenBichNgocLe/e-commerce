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

    async findMyCart(userId: number) {
        await this.updateTotal(userId);
        const updatedUser = await this.userRepository.findOne({
            where: { id: userId },
        });
        return updatedUser.cart;
    }

    async updateTotal(userId: number) {
        const user = await this.userRepository.findOne({ 
            where: { id: userId },
        });
        if(!user) throw new NotFoundException('User not found');

        const total = user.cart.items.reduce((total, item) => total + (item.quantity * item.product.price), 0);
        await this.cartRepository.update(user.cart.id, 
            { total: total }
        );
    }

    async findAll() {
        return await this.cartRepository.find();
    }

    async addItem(userId: number, createItemDto: CreateItemDto) {
        const { productId, quantity } = createItemDto;

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if(!user) throw new NotFoundException('User not found');

        const product = await this.productRepository.findOne({
            where: { id: productId }
        });
        if(!product) throw new NotFoundException('Product not found');

        const existingItem = user.cart.items.find((item) => item.product.id === productId);

        if(!existingItem) {
            const newItem = await this.itemRepository.create({
                ...createItemDto,
                product: { id: productId },
                cart: { id: user.cart.id },
                subtotal: product.price * quantity,
            });
            await this.itemRepository.save(newItem);
            user.cart.items.push(newItem);
        } else {
            await this.itemRepository.update(existingItem.id, {
                quantity: quantity,
                subtotal: quantity * product.price,
            });
        }

        await this.updateTotal(userId);

        const updatedUser = await this.userRepository.findOne({
            where: { id: userId },
        });
        delete updatedUser.password;
        delete updatedUser.hashedRefreshToken;
        return updatedUser;
    }

    async removeAnItem(userId: number, productId: number) {
        const user = await this.userRepository.findOne({ 
            where: { id: userId },
        });
        if(!user) throw new NotFoundException('User not found');

        const product = await this.productRepository.findOne({ 
            where: { id: productId },
        });
        if(!product) throw new NotFoundException('Product not found');

        const item = await user.cart.items.find((item) => item.product.id === productId);
        if(!item) throw new NotFoundException('Item not found');

        await this.itemRepository.delete(item.id);
        await this.updateTotal(userId);
        const updatedUser = await this.userRepository.findOne({
            where: { id: userId },
        });

        return updatedUser.cart;
    }

    async emptyCart(userId: number) {
        const user = await this.userRepository.findOne({ 
            where: { id: userId },
        });
        if(!user) throw new NotFoundException('User not found');

        await this.itemRepository.remove(user.cart.items);
        await this.cartRepository.update(user.cart.id, {
            total: 0
        });
        const updatedUser = await this.userRepository.findOne({
            where: { id: userId },
        });
        delete updatedUser.password;
        delete updatedUser.hashedRefreshToken;
        
        return updatedUser;
    }
}
