import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get('all')
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get('filteredProduct')
  async findFilteredProduct(@Body() filterProductDto: FilterProductDto) {
    return this.productsService.findFilteredProduct(filterProductDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
    return { message: `Product with ID ${id} deleted successfully` };
  }
}
