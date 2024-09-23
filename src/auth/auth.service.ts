import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { ConfigType } from '@nestjs/config';
import refreshJwtConfig from './config/refresh-jwt.config';
import * as argon2 from 'argon2';

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
        // const payload: AuthJwtPayload = { sub: userId };
        // const token = this.jwtService.sign(payload);
        // const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
        const { accessToken, refreshToken } = await this.generateTokens(userId);
        const hashedRefreshToken = await argon2.hash(refreshToken);
        await this.usersService.updateHashedRefreshToken(userId, hashedRefreshToken);
        return {
            id: userId,
            accessToken,
            refreshToken,
        };
    }

    async generateTokens(userId: number) {
        const payload: AuthJwtPayload = { sub: userId };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfig)
        ]);
        return {
            accessToken,
            refreshToken
        };
    }

    async refreshToken(userId: number) {
        const { accessToken, refreshToken } = await this.generateTokens(userId);
        const hashedRefreshToken = await argon2.hash(refreshToken);
        await this.usersService.updateHashedRefreshToken(userId, hashedRefreshToken);
        return {
            id: userId,
            accessToken,
            refreshToken,
        };
    }

    async validateRefreshToken(userId: number, refreshToken: string) {
        const user = await this.usersService.findOne(userId);
        if(!user || !user.hashedRefreshToken) throw new UnauthorizedException("Invalid Refresh Token");

        const refreshTokenMatches = await argon2.verify(user.hashedRefreshToken, refreshToken);
        if(!refreshTokenMatches) throw new UnauthorizedException("Invalid Refresh Token");

        return {
            id: userId,
        };
    }

    async signOut(userId: number) {
        await this.usersService.updateHashedRefreshToken(userId, null);
    }
}
