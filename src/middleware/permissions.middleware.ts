import {Request, Response, NextFunction} from "express";
import AuthenticatedRequest from "../common/interfaces/authenticated-request";
import {UserType} from "../users/model/user-type.enum";
import HttpError from "../common/errors/http.error";

export default class PermissionsMiddleware {
    constructor(private readonly menuItemsRepository: MenuItemsRepository) {
        this.ownsMenuItem = this.ownsMenuItem.bind(this);
    }


    async isVendor(request: Request, response: Response, next: NextFunction) {
        const userType = (request as AuthenticatedRequest).userType;

        if (userType != UserType.VENDOR) {
            next(new HttpError('You are not authorized to use this endpoint', 403));
            return;
        }

        next();
    }

    async ownsMenuItem(request: Request, response: Response, next: NextFunction) {
        const vendorId = (request as AuthenticatedRequest).vendorId;
        const menuItemId = Number(request.params.menuItemId);

        await this.menuItemsRepository.findOne({
            where: {
                id: menuItemId,
            }, relations: {vendor: true}
        }).then(menuItem => {
            if (menuItem && menuItem.vendor.id != vendorId) {
                next(new HttpError('You are not authorized to use this endpoint', 403));
            }
            return;
        });

        next();
    }

}