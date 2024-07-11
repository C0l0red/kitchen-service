import {IsNotEmpty, IsString, MinLength, validate } from "class-validator";
import RequestValidationError from "../../common/errors/request-validation.error";
import { CreateUserDto } from "../../users/dto/create-user.dto";

export class CreateVendorDto extends CreateUserDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    businessName: string;

    @IsString()
    @MinLength(10)
    @IsNotEmpty()
    businessDescription: string;
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