import {IsNotEmpty, IsNumber, IsOptional, IsString, validate} from "class-validator";
import RequestValidationError from "../../common/errors/request-validation.error";

export default class CreateMenuItemDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}

export async function createMenuItemDtoMapper(object: any): Promise<CreateMenuItemDto> {
    const createMenuItemDto = new CreateMenuItemDto();
    createMenuItemDto.name = object.name;
    createMenuItemDto.description = object.description;
    createMenuItemDto.price = object.price;

    await validate(createMenuItemDto, {forbidUnknownValues: true}).then(errors => {
        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }
    });

    return createMenuItemDto;
}