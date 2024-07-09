import {IsNumber, IsOptional, IsString, validate} from "class-validator";
import RequestValidationError from "../../common/errors/request-validation.error";
import HttpError from "../../common/errors/http.error";

export default class UpdateMenuItemDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    price?: number;
}

export async function updateMenuItemDtoMapper(object: any): Promise<UpdateMenuItemDto> {
    const updateMenuItemDto = new UpdateMenuItemDto();
    updateMenuItemDto.name = object.name;
    updateMenuItemDto.description = object.description;
    updateMenuItemDto.price = object.price;

    await validate(updateMenuItemDto, {forbidUnknownValues: true}).then(errors => {
        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }
    });

    const updatedFields = Object.values(updateMenuItemDto).filter(value => value != undefined).length;
    if (!updatedFields) {
        throw new HttpError('No field passed for update', 400);
    }

    return updateMenuItemDto;
}