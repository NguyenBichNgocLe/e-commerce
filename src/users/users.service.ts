import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { encodePassword } from 'src/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
    return await this.userRepository.update({ id:userId }, { hashedRefreshToken });
  }

  async create(createUserDto: CreateUserDto) {
    const password = await encodePassword(createUserDto.password);
    // const user = this.userRepository.create({ ...createUserDto, password });
    const user = this.userRepository.create({ ...createUserDto, password, cart: {items: [], total: 0} });
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'username', 'email']
    });
  }

  async findOneWithUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { username },
    });
    if(!user) {
      throw new NotFoundException(`User with username ${username} not found`)
    }
    return user;
  }

  async findOne(id: number) {
    const user =  await this.userRepository.findOne({ 
      where: { id }
    });

    if(!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if(!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    } else {
      if(updateUserDto.password) {
        updateUserDto.password = await encodePassword(updateUserDto.password);
      }
      await this.userRepository.update(id, { ...updateUserDto });
    }
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if(!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    } else {
      await this.userRepository.delete(id);
    }
  }
}
