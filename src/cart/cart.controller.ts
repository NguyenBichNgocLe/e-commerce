import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
    ) {}

    @Roles(Role.USER)
    @UseGuards(RolesGuard)
    @UseGuards(JwtGuard)
    @Get('myCart')
    async findMyCart(
        @Req() req,
    ) {
        return this.cartService.findMyCart(req.user.id);
    }

    @Get('all')
    async findAll() {
        return this.cartService.findAll();
    }

    @Roles(Role.USER)
    @UseGuards(RolesGuard)
    @UseGuards(JwtGuard)
    @Post('addItem')
    async addItem(
        @Req() req,
        @Body() createItemDto: CreateItemDto,
    ) {
        return this.cartService.addItem(req.user.id, createItemDto);
    }

    @Roles(Role.USER)
    @UseGuards(RolesGuard)
    @UseGuards(JwtGuard)
    @Delete('item/:productId')
    async removeAnItem(
        @Req() req,
        @Param('productId') productId: string
    ) {
        return await this.cartService.removeAnItem(req.user.id, +productId);
    }

    @Roles(Role.USER)
    @UseGuards(RolesGuard)
    @UseGuards(JwtGuard)
    @Delete('emptyCart')
    async emptyCart(
        @Req() req
    ) {
        return await this.cartService.emptyCart(req.user.id);
    }
}
