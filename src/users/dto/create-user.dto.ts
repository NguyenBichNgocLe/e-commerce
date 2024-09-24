import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    @Length(5, 50, { message: 'Username must be between 5 and 50 characters' })
    username: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Please provide a valid email' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
}