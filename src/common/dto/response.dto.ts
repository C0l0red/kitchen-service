export default class ResponseDto<T> {
    message: string;
    data?: T;
}

export function responseDtoMapper<T>(message: string, data?: T): ResponseDto<T> {
    return {
        message,
        data
    }
}