import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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

    @Get('single/:userId')
    async findOne(
        @Param('userId') userId: number
    ) {
        return this.cartService.findOne(userId);
    }

    @Get('all')
    async findAll() {
        return this.cartService.findAll();
    }

    // @Roles(Role.USER)
    // @UseGuards(RolesGuard)
    // @UseGuards(JwtGuard)
    @Post('addItem/:userId')
    async addItem(
        //@Req() req,
        @Param('userId') userId: number,
        @Body() createItemDto: CreateItemDto,
    ) {
        return this.cartService.addItem(userId, createItemDto);
    }
}
