import Customer from "../models/customer.entity";

export default class CustomerDto implements Dto<Customer> {
    id: number;
    firstName: string;
    lastName: string;
}

export function buildCustomerDto(customer: Customer): CustomerDto {
    return {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
    }
}