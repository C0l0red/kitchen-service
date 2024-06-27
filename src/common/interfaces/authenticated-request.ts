import {Request} from "express";
import {UserType} from "../../users/model/user-type.enum";

export default interface AuthenticatedRequest extends Request {
    email: string;
    userId: number;
    userType: UserType;
}