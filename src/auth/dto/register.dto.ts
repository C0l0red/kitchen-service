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

export class CreateCustomerDto extends RegisterDto {
    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    lastName: string;
}

export class CreateVendorDto extends RegisterDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    businessName: string;

    @IsString()
    @MinLength(10)
    @IsNotEmpty()
    businessDescription: string;
}

export async function createCustomerDtoMapper(object: any): Promise<CreateCustomerDto> {
    const createCustomerDto = new CreateCustomerDto();
    createCustomerDto.email = object.email;
    createCustomerDto.password = object.password;
    createCustomerDto.firstName = object.firstName;
    createCustomerDto.lastName = object.lastName;
    createCustomerDto.phoneNumber = object.phoneNumber;

    await validate(createCustomerDto, {forbidUnknownValues: true}).then(errors => {
        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }
    });

    return createCustomerDto;
}

export async function createVendorDtoMapper(object: any): Promise<CreateVendorDto> {
    const createVendorDto = new CreateVendorDto();
    createVendorDto.email = object.email;
    createVendorDto.password = object.password;
    createVendorDto.businessName = object.businessName;
    createVendorDto.businessDescription = object.businessDescription;
    createVendorDto.phoneNumber = object.phoneNumber;

    await validate(createVendorDto, {forbidUnknownValues: true}).then(errors => {
        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }
    });

    return createVendorDto;
}