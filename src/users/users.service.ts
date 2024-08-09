import HttpError from "../common/errors/http.error";
import {EntityManager} from "typeorm";
import {UserType} from "./model/user-type.enum";
import User from "./model/user.entity";
import Logger from "../common/logger";
import EncryptionService from "../common/encryption.service";
import {CreateUserDto} from "./dto/create-user.dto";

export default class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {
    }

    async createUser(createUserDto: CreateUserDto, userType: UserType, transactionalEntityManager: EntityManager) {
        await transactionalEntityManager.findOneBy(User, {email: createUserDto.email}).then(user => {
            if (user) throw new HttpError("A user with this email already exists", 409);
        });
        const password = await EncryptionService.generateHash(createUserDto.password);

        let user = transactionalEntityManager.create(User, {
            email: createUserDto.email,
            password: password,
            phoneNumber: createUserDto.phoneNumber,
            userType: userType
        });
        user = await transactionalEntityManager.save(user);
        Logger.log(`New user '${user.email}' created successfully`);

        return user;
    }

    async getProfile(userId: number): Promise<User> {
        return await this.findUserById(userId);
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
            select: includePassword ? ['id', 'email', 'password', 'userType'] : ['id', 'email', 'userType'],
            relations: ['vendor']
        });
    }
}