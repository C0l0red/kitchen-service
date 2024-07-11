import AuthService from "./auth.service";
import EncryptionService from "../common/encryption.service";
import {UserType} from "../users/model/user-type.enum";
import {DatabaseManager} from "../data-source";
import {dataSource} from "../../tests/data";
import UsersService from "../users/users.service";
import User from "../users/model/user.entity";
import Customer from "../customers/models/customer.entity";


describe("Auth Service", () => {
    let service: AuthService;
    let usersService: UsersService;
    let usersRepository: UsersRepository;
    const databaseManager = new DatabaseManager(dataSource);
    const partialUser: Partial<User> = {
        email: 'test@email.com',
        password: 'password',
        phoneNumber: '+2348123456789',
        userType: UserType.CUSTOMER,
    };
    let user: User;

    beforeEach(async () => {
        await databaseManager.initializeDatasource();

        usersRepository = databaseManager.getRepository(User);
        usersService = new UsersService(usersRepository);

        service = new AuthService(usersService);
        await setupUser();
    });

    afterEach(async () => {
        jest.clearAllMocks();
        await databaseManager.destroyDatabase();
    });

    const setupUser = async () => {
        const partialCustomer: Partial<Customer> = {
            firstName: 'Test',
            lastName: 'User',
        };

        const hashedPassword = await EncryptionService.generateHash(partialUser.password!);

        user = await usersRepository.save({...partialUser, password: hashedPassword});
        const customersRepository = databaseManager.getRepository(Customer);
        const customer = await customersRepository.save({...partialCustomer, user});
    };

    describe("login", () => {
        it("should call findUserByEmail(), compareHash() and generateToken() once each", async () => {
            const spyOnFindUserByEmail = jest.spyOn(usersService, 'findUserByEmail');
            const spyOnCompareHash = jest.spyOn(EncryptionService, 'compareHash');
            const spyOnGenerateToken = jest.spyOn(EncryptionService, 'generateToken');

            await service.login({email: partialUser.email!, password: partialUser.password!});

            expect(spyOnFindUserByEmail).toHaveBeenCalledTimes(1);
            expect(spyOnFindUserByEmail).toHaveBeenCalledWith(partialUser.email, true);

            expect(spyOnCompareHash).toHaveBeenCalledTimes(1);
            expect(spyOnCompareHash).toHaveBeenCalledWith(partialUser.password!, user.password);

            expect(spyOnGenerateToken).toHaveBeenCalledTimes(1);
            expect(spyOnGenerateToken).toHaveBeenCalledWith({
                sub: user.email,
                id: user.id,
                userType: user.userType
            });
        });

        it("should throw if no user is returned", async () => {
            await expect(service.login({
                email: "invalid@test.com",
                password: "password"
            })).rejects.toThrow("Invalid Credentials");
        });

        it("should throw if password doesn't match", async () => {
            const mockCompareHash = jest.spyOn(EncryptionService, 'compareHash');
            mockCompareHash.mockResolvedValue(false);

            await expect(service.login({
                email: partialUser.email!,
                password: partialUser.password!
            })).rejects.toThrow("Invalid Credentials");
        });
    });
})