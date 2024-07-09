import CustomersService from "./customers.service";
import {mockDataSource, mockCreateCustomerDto} from "../../tests/mocks";

describe('CustomersService', () => {
    let service: CustomersService;

    beforeEach(() => {
        service = new CustomersService(mockDataSource);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('createCustomer', () => {

        it('should run with no errors', async () => {
            await service.createCustomer(mockCreateCustomerDto);
        });
    });

});