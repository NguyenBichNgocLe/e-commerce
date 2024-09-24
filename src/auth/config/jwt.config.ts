import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export default registerAs(
    'jwt', 
    (): JwtModuleOptions => ({
        secret: `${process.env.jwt_secret}`,
        signOptions: {
            expiresIn: `15m`,
        },
    }),
);