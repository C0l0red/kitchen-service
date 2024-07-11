import LoginDto from "./dto/login.dto";
import UsersService from "../users/users.service";
import HttpError from "../common/errors/http.error";
import {mapToJwtPayload} from "../common/dto/jwt-payload.dto";
import {mapTotokenDto} from "./dto/token.dto";
import EncryptionService from "../common/encryption.service";
import Logger from "../common/logger";


export default class AuthService {
    constructor(private readonly usersService: UsersService) {
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findUserByEmail(dto.email, true);
        if (!(user && await EncryptionService.compareHash(dto.password, user.password))) {
            throw new HttpError("Invalid Credentials", 401);
        }

        const payload = mapToJwtPayload(user);
        const token = EncryptionService.generateToken(payload);

        Logger.log(`User '${user.email}' logged in successfully`);

        return mapTotokenDto(token);
    }
}