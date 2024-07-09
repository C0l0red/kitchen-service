import User from "../model/user.entity";
import {UserType} from "../model/user-type.enum";
import VendorDto, {vendorDtoMapper} from "../../vendors/dto/vendor.dto";
import CustomerDto, {customerDtoMapper} from "../../customers/dto/customer.dto";

export default class UserDto implements Dto<User> {
    id: number;
    email: string;
    phoneNumber: string;
    userType: UserType;
    vendor?: VendorDto;
    customer?: CustomerDto;
}

export function userDtoMapper(user: User): UserDto {
    return {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        vendor: user.userType == UserType.VENDOR ? vendorDtoMapper(user.vendor!) : undefined,
        customer: user.userType == UserType.CUSTOMER ? customerDtoMapper(user.customer!) : undefined,
    }
}