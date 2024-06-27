import {buildUserDto} from "./dto/user.dto";
import User from "./model/user.entity";
import Logger from "../common/logger";
import HttpError from "../common/errors/http.error";

export default class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {
    }

    async getProfile(userId: number) {
        const user = await this.findUserById(userId);

        return buildUserDto(user);
    }

    async findUserById(userId: number) {
        return this.usersRepository.findOneBy({id: userId}).then(user => {
            if (!user) {
                throw new HttpError(`User with ID ${userId} not found`, 404);
            }
            return user;
        });
    }

    async findUserByEmail(email: string, includePassword?: boolean) {
        return this.usersRepository.findOne({
            where: {email},
            select: includePassword ? ['id', 'email', 'password', 'userType'] : ['id', 'email', 'userType']
        });
    }
}