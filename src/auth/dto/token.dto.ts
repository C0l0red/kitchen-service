export default class TokenDto {
    token: string;
}

export function mapTotokenDto(token: string): TokenDto {
    return {
        token
    }
}