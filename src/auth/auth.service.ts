import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { ConfigType } from '@nestjs/config';
import refreshJwtConfig from './config/refresh-jwt.config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        @Inject(refreshJwtConfig.KEY) 
        private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOneWithUsername(username);
        if(!user) throw new UnauthorizedException('User not found!');
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) throw new UnauthorizedException('Invalid credentials');

        return { id: user.id };
    }

    async login(userId: number) {
        const payload: AuthJwtPayload = { sub: userId };
        const token = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
        return {
            id: userId,
            token: token,
            refreshToken: refreshToken,
        };
    }

    async refreshToken(userId: number) {
        const payload: AuthJwtPayload = { sub: userId };
        const token = this.jwtService.sign(payload);
        return {
            id: userId,
            token,
        }
    }
}
