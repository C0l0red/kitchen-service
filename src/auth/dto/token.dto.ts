export default class TokenDto {
    token: string;
}

export function mapToTokenDto(token: string): TokenDto {
    return {
        token
    }
}