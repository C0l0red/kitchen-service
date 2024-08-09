import User from "../model/user.entity";
import {UserType} from "../model/user-type.enum";
import VendorDto, {mapToVendorDto} from "../../vendors/dto/vendor.dto";
import CustomerDto, {mapToCustomerDto} from "../../customers/dto/customer.dto";

export default class UserDto implements Dto<User> {
    id: number;
    email: string;
    phoneNumber: string;
    userType: UserType;
    vendor?: VendorDto;
    customer?: CustomerDto;
}

export function mapTouserDto(user: User): UserDto {
    return {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        vendor: user.vendor ? mapToVendorDto(user.vendor!) : undefined,
        customer: user.customer ? mapToCustomerDto(user.customer!) : undefined,
    }
}