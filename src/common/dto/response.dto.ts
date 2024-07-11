export default class ResponseDto<T> {
    message: string;
    data?: T;
}

export function mapToresponseDto<T>(message: string, data?: T): ResponseDto<T> {
    return {
        message,
        data
    }
}