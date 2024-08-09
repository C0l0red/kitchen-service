export default class ResponseDto<T> {
    message: string;
    data?: Dto<T>;
}

export function mapToresponseDto<T>(message: string, data?: T, dtoMapper?: (entity:T) => Dto<T>): ResponseDto<Dto<T>> {
    return {
        message,
        data: data && dtoMapper ? dtoMapper(data) : undefined,
    }
}