import UserDto, {userDtoMapper} from "./dto/user.dto";
import HttpError from "../common/errors/http.error";

export default class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {
    }

    async getProfile(userId: number): Promise<UserDto> {
        const user = await this.findUserById(userId);

        return userDtoMapper(user);
    }

    async findUserById(userId: number) {
        return this.usersRepository.findOne({
            where: {id: userId},
            relations: {vendor: true, customer: true}
        }).then(user => {
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