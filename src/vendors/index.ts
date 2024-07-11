import VendorsService from "./vendors.service";
import UsersService from "../users/users.service";
import {Router} from "express";
import VendorsController from "./vendors.controller";
import {DataSource} from "typeorm";
import Vendor from "./models/vendor.entity";

const createVendorsModule = (dataSource: DataSource, usersService: UsersService, authorizationMiddleware: Middleware) => {
    const vendorsRepository: VendorsRepository = dataSource.getRepository(Vendor);
    const vendorsService = new VendorsService(vendorsRepository, dataSource, usersService);
    const vendorsController = new VendorsController(vendorsService);

    const router = Router();

    router.get('', authorizationMiddleware, vendorsController.listVendors.bind(vendorsController));
    router.get('/:vendorId', authorizationMiddleware, vendorsController.getVendorDetails.bind(vendorsController));
    router.post('', vendorsController.createVendor.bind(vendorsController));

    return {
        router,
        vendorsService
    }
};

export default createVendorsModule;