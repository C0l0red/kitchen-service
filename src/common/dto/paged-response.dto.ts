import PagedRequestDto from "./paged-request.dto";

export default class PagedResponseDto<T> {
    message: string;
    data?: Dto<T>[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

export function mapToPagedResponseDto<T>(
    message: string,
    entitiesAndCount: EntityListAndCount<T>,
    pagedRequest: PagedRequestDto,
    dtoMapper: (entities: T[]) => Dto<T>[],
): PagedResponseDto<T> {
    return {
        message,
        page: pagedRequest.page,
        pageSize: pagedRequest.pageSize,
        totalPages: Math.ceil(entitiesAndCount.count / pagedRequest.pageSize),
        totalItems: entitiesAndCount.count,
        data: dtoMapper(entitiesAndCount.entities),
    }
}