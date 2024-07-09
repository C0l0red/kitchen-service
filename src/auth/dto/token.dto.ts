export default class TokenDto {
    token: string;
}

export function tokenDtoMapper(token: string): TokenDto {
    return {
        token
    }
}