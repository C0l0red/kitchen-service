import {CreateCustomerDto} from "../auth/dto/register.dto";
import {UserType} from "../users/model/user-type.enum";
import Logger from "../common/logger";
import {DataSource} from "typeorm";
import User from "../users/model/user.entity";
import Customer from "./models/customer.entity";

export default class CustomersService {
    constructor(private readonly dataSource: DataSource) {
    }

    async createCustomer(createCustomerDto: CreateCustomerDto) {
        // This operation is transactional
        await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
            let user = transactionalEntityManager.create(User, {
                email: createCustomerDto.email,
                password: createCustomerDto.password,
                phoneNumber: createCustomerDto.phoneNumber,
                userType: UserType.CUSTOMER
            });
            user = await transactionalEntityManager.save(user);
            Logger.log(`New user '${user.email}' created successfully`);

            await transactionalEntityManager.save(Customer, {
                firstName: createCustomerDto.firstName,
                lastName: createCustomerDto.lastName,
                user
            });

            Logger.log(`Customer ${createCustomerDto.firstName} created successfully`);
        });
    }
}