import User from "../model/user.entity";
import {UserType} from "../model/user-type.enum";

export default class UserDto implements Dto<User> {
    id: number;
    email: string;
    phoneNumber: string;
    userType: UserType;
}

export function buildUserDto(user: User): UserDto {
    return {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
    }
}