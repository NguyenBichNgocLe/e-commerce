import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOneWithUsername(username);
        // if(user && (await bcrypt.compare(password, user.password))) {
        //     const { password, ...result } = user;
        //     return result;
        // }
        // return null;
        if(!user) throw new UnauthorizedException('User not found!');
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) throw new UnauthorizedException('Invalid credentials');

        return { id: user.id };
    }

    // async login(user: User) {
    //     const payload = {
    //         username: user.email,
    //         sub: {
    //             name: user.username,
    //         }
    //     }

    //     return {
    //         ...user,
    //         accessToken: this.jwtService.sign(payload),
    //         refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' })
    //     };
    // }

    async login(userId: number) {
        const payload: AuthJwtPayload = { sub: userId };
        const token = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });
        return {
            id: userId,
            token: token,
            refreshToken: refreshToken,
        }
    }

    // async refreshToken(user: User) {
    //     const payload = {
    //         username: user.email,
    //         sub: {
    //             name: user.username,
    //         }
    //     }

    //     return {
    //         accessToken: this.jwtService.sign(payload),
    //     };
    // }

    async refreshToken(userId: number) {
        const payload: AuthJwtPayload = { sub: userId };
        const token = this.jwtService.sign(payload);
        return {
            id: userId,
            token,
        }
    }
}
