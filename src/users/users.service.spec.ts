import UsersService from "./users.service";
import {DatabaseManager} from "../data-source";
import {dataSource} from "../../tests/data";
import User from "./model/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserType} from "./model/user-type.enum";
import EncryptionService from "../common/encryption.service";
import Customer from "../customers/models/customer.entity";


describe("Users Service", () => {
    let usersService: UsersService;
    let usersRepository: UsersRepository;
    const databaseManager = new DatabaseManager(dataSource);
    let testUser: User;

    beforeEach(async () => {
        await databaseManager.initializeDatasource();
        usersRepository = databaseManager.getRepository(User);
        usersService = new UsersService(usersRepository);

        await setupUser();
    })

    afterEach(async () => {
        jest.clearAllMocks();
        await databaseManager.destroyDatabase();
    });

    const setupUser = async () => {
        const partialUser: Partial<User> = {
            email: 'test@email.com',
            password: 'password',
            phoneNumber: '+2348123456789',
            userType: UserType.CUSTOMER
        };
        testUser = await usersRepository.save(partialUser);
        const customerRepository = databaseManager.getRepository(Customer);
        const partialCustomer: Partial<Customer> = {
            firstName: 'Test',
            lastName: 'User'
        };
        await customerRepository.save({...partialCustomer, user: testUser});
    };

    describe("createUser", () => {
        const createUserDto: CreateUserDto = {
            email: 'user@email.com',
            password: 'password',
            phoneNumber: '+2348123456789',
        }
        it('should create a new user', async () => {
            await databaseManager.getDataSource().manager.transaction(async (transactionalEntityManager) => {
                await usersService.createUser(createUserDto, UserType.CUSTOMER, transactionalEntityManager);
            });

            const user = await usersRepository.findOne({
                where: {email: createUserDto.email},
                select: ['id', 'email', 'phoneNumber', 'password']
            });

            expect(user).toBeDefined();
            expect(user?.phoneNumber).toEqual(createUserDto.phoneNumber);
            expect(EncryptionService.compareHash(createUserDto.password, user?.password!))
        });

        it('should throw an error on duplicate emails', async () => {
            await databaseManager.getDataSource().manager.transaction(async (transactionalEntityManager) => {
                await usersService.createUser(createUserDto, UserType.CUSTOMER, transactionalEntityManager);
                await expect(usersService.createUser(createUserDto, UserType.VENDOR, transactionalEntityManager))
                    .rejects.toThrow("A user with this email already exists");
            });
        });
    });

    describe("getProfile", () => {
        it("should call findOneBy() once", async () => {
            const spyOnFindOne = jest.spyOn(usersRepository, 'findOne');

            await usersService.getProfile(testUser.id);
            expect(spyOnFindOne).toHaveBeenCalledTimes(1);
            expect(spyOnFindOne).toHaveBeenCalledWith({
                where: {id: testUser.id},
                relations: {vendor: true, customer: true}
            });
        });

        it('should throw an error if no user found', async () => {
            await expect(usersService.getProfile(2)).rejects.toThrow('User with ID 2 not found');
        });
    });

    describe("findByUserId", () => {
        it("should call findOneBy() once", async () => {
            const spyOnFindOne = jest.spyOn(usersRepository, 'findOne');

            await usersService.findUserById(testUser.id);
            expect(spyOnFindOne).toHaveBeenCalledTimes(1);
            expect(spyOnFindOne).toHaveBeenCalledWith({
                where: {id: testUser.id},
                relations: {vendor: true, customer: true}
            });
        });

        it("should throw if no user is found", async () => {
            const spyOnFindOne = jest.spyOn(usersRepository, 'findOne');

            await expect(usersService.findUserById(2)).rejects.toThrow('User with ID 2 not found');
            expect(spyOnFindOne).toHaveBeenCalledTimes(1);
        });
    });

    describe("findUserByEmail", () => {
        it("should call findOne() once", async () => {
            const spyOnFindOne = jest.spyOn(usersRepository, 'findOne');

            await usersService.findUserByEmail(testUser.email);
            expect(spyOnFindOne).toHaveBeenCalledTimes(1);
            expect(spyOnFindOne).toHaveBeenCalledWith({
                where: {email: testUser.email},
                select: ['id', 'email', 'userType']
            });
        });

        it("should select password when included", async () => {
            const spyOnFindOne = jest.spyOn(usersRepository, 'findOne');

            await usersService.findUserByEmail(testUser.email, true);
            expect(spyOnFindOne).toHaveBeenCalledTimes(1);
            expect(spyOnFindOne).toHaveBeenCalledWith({
                where: {email: testUser.email},
                select: ['id', 'email', 'password', 'userType']
            });
        });
    });
})