import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return product;
  }

  async findAll() {
    return this.productRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if(!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async findFilteredProduct(filterProductDto: FilterProductDto) {
    const { search, category } = filterProductDto;
    const query = this.productRepository.createQueryBuilder('product');
    if(search) {
      query.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` }
      );
    }
    if(category) {
      query.andWhere('product.category = :category', { category });
    }

    const products = await query.getMany();
    return products;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const oldProduct = await this.productRepository.findOne({ where: { id } });
    if(!oldProduct) throw new NotFoundException(`Product with ID ${id} not found`);
    await this.productRepository.update(id, { ...updateProductDto });
    return this.productRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if(!product) throw new NotFoundException(`Product with ID ${id} not found`);
    await this.productRepository.delete(id);
  }
}
