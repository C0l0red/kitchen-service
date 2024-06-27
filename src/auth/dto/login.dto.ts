import {IsString, validate} from "class-validator";
import RequestValidationError from "../../common/errors/request-validation.error";

export default class LoginDto {
    @IsString()
    email: string;

    @IsString()
    password: string;
}

export async function buildLoginDto(object: any) {
    const dto = new LoginDto();
    dto.email = object.email;
    dto.password = object.password;

    await validate(dto).then(errors => {
        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }
    })

    return dto;
}