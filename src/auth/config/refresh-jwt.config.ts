import { registerAs } from "@nestjs/config";
import { JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt";

export default registerAs(
    'jwt-refresh', 
    (): JwtSignOptions => ({
        secret: `${process.env.refresh_jwt_secret}`,
        expiresIn: '1d',
    }),
);