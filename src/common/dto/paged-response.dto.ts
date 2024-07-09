import PagedRequestDto from "./paged-request.dto";

export default class PagedResponseDto<T> {
    message: string;
    data?: T[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

export function pagedResponseDtoMapper<T>(
    message: string,
    dtosAndCount: DtoListAndCount<T>,
    pagedRequest: PagedRequestDto,
): PagedResponseDto<Dto<T>> {
    return {
        message,
        page: pagedRequest.page,
        pageSize: pagedRequest.pageSize,
        totalPages: Math.ceil(dtosAndCount.count / pagedRequest.pageSize),
        totalItems: dtosAndCount.count,
        data: dtosAndCount.entities,
    }
}