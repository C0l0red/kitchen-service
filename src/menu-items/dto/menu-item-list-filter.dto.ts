import {IsNumberString, IsOptional, validate} from "class-validator";
import RequestValidationError from "../../common/errors/request-validation.error";

export default class MenuItemListFilterDto {
    @IsOptional()
    @IsNumberString()
    vendorId?: number;
}

export async function mapToMenuItemListFilterDto(object: any): Promise<MenuItemListFilterDto> {
    const menuItemListQueryDto = new MenuItemListFilterDto();
    menuItemListQueryDto.vendorId = object.vendorId;

    await validate(menuItemListQueryDto).then(errors => {
        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }
    });

    return menuItemListQueryDto;
}