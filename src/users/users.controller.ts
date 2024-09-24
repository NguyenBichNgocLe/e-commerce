import { Controller, Get, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards, Req, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtGuard)
  @Get('all')
  async findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtGuard)
  @Patch()
  async update(
    @Req() req, 
    @Body() updateUserDto: UpdateUserDto) {
      try {
        await this.usersService.update(req.user.id, updateUserDto);
        return this.usersService.findOne(req.user.id);
      } catch (error) {
        throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
      }
    
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.usersService.remove(id);
      return { message: `User with ID ${id} deleted successfully!` };
    } catch(error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
