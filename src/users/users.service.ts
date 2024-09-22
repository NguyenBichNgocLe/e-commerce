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

  async create(createUserDto: CreateUserDto) {
    const password = await encodePassword(createUserDto.password);
    const user = this.userRepository.create({ ...createUserDto, password });
    await this.userRepository.save(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneWithUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if(!user) {
      throw new NotFoundException(`User with username ${username} not found`)
    }
    return user;
  }

  async findOne(id: number): Promise<User> {
    const user =  await this.userRepository.findOne({ where: { id } });
    if(!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
