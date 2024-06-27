import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length,
    MinLength,
    validate
} from "class-validator";
import RequestValidationError from "../../common/errors/request-validation.error";

export class RegisterDto {
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

export class RegisterCustomerDto extends RegisterDto {
    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    lastName: string;
}

export class RegisterVendorDto extends RegisterDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    businessName: string;

    @IsString()
    @MinLength(10)
    @IsNotEmpty()
    businessDescription: string;
}

export async function buildRegisterCustomerDto(object: any) {
    const registerCustomerDto = new RegisterCustomerDto();
    registerCustomerDto.email = object.email;
    registerCustomerDto.password = object.password;
    registerCustomerDto.firstName = object.firstName;
    registerCustomerDto.lastName = object.lastName;
    registerCustomerDto.phoneNumber = object.phoneNumber;

    await validate(registerCustomerDto, {forbidUnknownValues: true}).then(errors => {
        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }
    });

    return registerCustomerDto;
}

export async function buildRegisterVendorDto(object: any) {
    const registerVendorDto = new RegisterVendorDto();
    registerVendorDto.email = object.email;
    registerVendorDto.password = object.password;
    registerVendorDto.businessName = object.businessName;
    registerVendorDto.businessDescription = object.businessDescription;
    registerVendorDto.phoneNumber = object.phoneNumber;

    await validate(registerVendorDto, {forbidUnknownValues: true}).then(errors => {
        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }
    });

    return registerVendorDto;
}