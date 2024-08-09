import CustomersService from "./customers.service";
import {DatabaseManager} from "../data-source";
import {dataSource} from "../../tests/data";
import Customer from "./models/customer.entity";
import UsersService from "../users/users.service";
import User from "../users/model/user.entity";
import EncryptionService from "../common/encryption.service";
import {CreateCustomerDto} from "./dto/create-customer.dto";

describe('CustomersService', () => {
    let service: CustomersService;
    let customersRepository: CustomersRepository;
    let usersService: UsersService;
    const databaseManager = new DatabaseManager(dataSource);

    beforeEach(async () => {
        await databaseManager.initializeDatasource();

        customersRepository = databaseManager.getRepository(Customer);
        usersService = new UsersService(databaseManager.getRepository(User));
        service = new CustomersService(databaseManager.getDataSource(), usersService);
    });

    afterEach(async () => {
        await databaseManager.destroyDatabase();
    })

    describe('createCustomer', () => {
        const createCustomerDto: CreateCustomerDto = {
            email: 'email@test.com',
            password: 'password',
            firstName: 'Test',
            lastName: 'User',
            phoneNumber: '08123456789'
        };

        it('should call generateHash() once and add a new customer', async () => {
            const spyOnGenerateHash = jest.spyOn(EncryptionService, 'generateHash');

            await service.createCustomer(createCustomerDto);

            expect(spyOnGenerateHash).toHaveBeenCalledTimes(1);
            expect(spyOnGenerateHash).toHaveBeenCalledWith(createCustomerDto.password);

            const customer = await customersRepository.findOne({
                where: {firstName: createCustomerDto.firstName},
                relations: ['user']
            });

            expect(customer).toBeDefined();
            expect(customer?.lastName).toEqual(createCustomerDto.lastName);
            expect(customer?.user).toBeDefined();
            expect(customer?.user.email).toEqual(createCustomerDto.email);
        });
    });

});