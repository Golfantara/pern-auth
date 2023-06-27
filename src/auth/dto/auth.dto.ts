import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class AuthDto {
    @IsEmail()
    email: string;

    @Length(3, 20, { message: 'password has to be at between 3 and 20 characters'})
    password: string;
}