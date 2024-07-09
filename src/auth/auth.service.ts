import LoginDto from "./dto/login.dto";
import {CreateCustomerDto, RegisterDto, CreateVendorDto} from "./dto/register.dto";
import UsersService from "../users/users.service";
import HttpError from "../common/errors/http.error";
import {jwtPayloadMapper} from "../common/dto/jwt-payload.dto";
import {tokenDtoMapper} from "./dto/token.dto";
import EncryptionService from "../common/encryption.service";
import Logger from "../common/logger";
import {UserType} from "../users/model/user-type.enum";
import VendorsService from "../vendors/vendors.service";
import CustomersService from "../customers/customers.service";

export default class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly vendorsService: VendorsService,
        private readonly customersService: CustomersService
    ) {
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findUserByEmail(dto.email, true);
        if (!(user && await EncryptionService.compareHash(dto.password, user.password))) {
            throw new HttpError("Invalid Credentials", 401);
        }

        const payload = jwtPayloadMapper(user);
        const token = EncryptionService.generateToken(payload);

        Logger.log(`User '${user.email}' logged in successfully`);

        return tokenDtoMapper(token);
    }

    async register(dto: RegisterDto, userType: UserType) {
        await this.usersService.findUserByEmail(dto.email).then(user => {
            if (user) throw new HttpError("A user with this email already exists", 409);
        });
        dto.password = await EncryptionService.generateHash(dto.password);

        switch (userType) {
            case UserType.CUSTOMER:
                await this.customersService.createCustomer(dto as CreateCustomerDto);
                break;
            case UserType.VENDOR:
                await this.vendorsService.createVendor(dto as CreateVendorDto);
                break;
        }

        Logger.log(`User ${dto.email} registered successfully`);
    }
}