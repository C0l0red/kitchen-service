export default class TokenDto {
    token: string;
}

export function buildTokenDto(token: string): TokenDto {
    return {
        token
    }
}