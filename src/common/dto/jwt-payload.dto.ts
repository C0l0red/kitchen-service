import User from "../../users/model/user.entity";
import {JwtPayload} from "jsonwebtoken";

export function mapToJwtPayload(user: User): JwtPayload {
    return {
        sub: user.email,
        id: user.id,
        userType: user.userType,
    }
}