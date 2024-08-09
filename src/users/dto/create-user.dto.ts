import {
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    Length,
} from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @Length(8, 20)
    @IsNotEmpty()
    password: string;

    @IsPhoneNumber('NG')
    @IsNotEmpty()
    phoneNumber: string;
}