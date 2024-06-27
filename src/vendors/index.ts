import VendorsService from "./vendors.service";
import UsersService from "../users/users.service";
import {Router} from "express";
import VendorsController from "./vendors.controller";
import {DataSource} from "typeorm";
import Vendor from "./models/vendor.entity";

const createVendorsModule = (dataSource: DataSource) => {
    const vendorsRepository: VendorsRepository = dataSource.getRepository(Vendor);
    const vendorsService = new VendorsService(vendorsRepository, dataSource);
    const vendorsController = new VendorsController(vendorsService);

    const router = Router();

    router.get('', vendorsController.listVendors.bind(vendorsController));
    router.get('/:vendorId', vendorsController.getVendorDetails.bind(vendorsController));

    return {
        router,
        vendorsService
    }
};

export default createVendorsModule;