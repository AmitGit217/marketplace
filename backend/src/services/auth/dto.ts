import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email!: string;

    @MinLength(8)
    password!: string;

    @IsString()
    name!: string;

    @IsString()
    role!: string;
}

export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;
}