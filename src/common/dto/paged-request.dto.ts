import {IsNumber, Min, validate} from "class-validator";
import RequestValidationError from "../errors/request-validation.error";

export default class PagedRequestDto {
    @IsNumber()
    @Min(1)
    page: number;

    @IsNumber()
    @Min(1)
    pageSize: number;
}

export async function buildPagedRequestDto(object: any): Promise<PagedRequestDto> {
    const dto = new PagedRequestDto();
    dto.page = parseInt(object.page ?? "1");
    dto.pageSize = parseInt(object.pageSize ?? "10");

    await validate(dto).then(errors => {
        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }
    });

    return dto;
}