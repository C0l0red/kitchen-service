import {IsNotEmpty, IsString, MinLength, validate} from "class-validator";
import RequestValidationError from "../../common/errors/request-validation.error";
import { CreateUserDto } from "../../users/dto/create-user.dto";

export class CreateCustomerDto extends CreateUserDto {
    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    lastName: string;
}


export async function mapToCreateCustomerDto(object: any): Promise<CreateCustomerDto> {
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