import {Request, Response, NextFunction} from "express";
import AuthenticatedRequest from "../common/interfaces/authenticated-request";
import {UserType} from "../users/model/user-type.enum";
import HttpError from "../common/errors/http.error";
import Logger from "../common/logger";

export default class PermissionsMiddleware {
    constructor(private readonly vendorsRepository: VendorsRepository) {
        this.ownsVendorAccount = this.ownsVendorAccount.bind(this);
    }


    async isVendor(request: Request, response: Response, next: NextFunction) {
        const userType = (request as AuthenticatedRequest).userType;

        if (userType != UserType.VENDOR) {
            next(new HttpError('You are not authorized to use this endpoint', 403));
            return;
        }

        next();
    }

    async ownsVendorAccount(request: Request, response: Response, next: NextFunction) {
        const userId = (request as AuthenticatedRequest).userId;
        const vendorId = Number(request.params.vendorId);

        await this.vendorsRepository.findOne({where: {id: vendorId, user: {id: userId}}}).then(vendor => {
            if (!vendor) next(new HttpError('You are not authorized to use this endpoint', 403));
            return;
        });

        next();
    }

}