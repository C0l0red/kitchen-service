import Logger from "../common/logger";
import {DataSource} from "typeorm";
import Customer from "./models/customer.entity";
import {CreateCustomerDto} from "./dto/create-customer.dto";
import UsersService from "../users/users.service";
import {UserType} from "../users/model/user-type.enum";

export default class CustomersService {
    constructor(private readonly dataSource: DataSource, private readonly usersService: UsersService) {
    }

    async createCustomer(createCustomerDto: CreateCustomerDto) {
        // This operation is transactional
        await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
            const user = await this.usersService.createUser(createCustomerDto, UserType.CUSTOMER, transactionalEntityManager);

            await transactionalEntityManager.save(Customer, {
                firstName: createCustomerDto.firstName,
                lastName: createCustomerDto.lastName,
                user
            });

            Logger.log(`Customer ${createCustomerDto.firstName} created successfully`);
        });
    }
}