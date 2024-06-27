import {Router} from "express";
import MenuItemsService from "./menu-items.service";
import MenuItemsController from "./menu-items.controller";
import PermissionsMiddleware from "../middleware/permissions.middleware";
import VendorsService from "../vendors/vendors.service";

const createMenuItemsModule = (
    menuItemsRepository: MenuItemsRepository,
    permissionsMiddleware: PermissionsMiddleware,
    vendorsService: VendorsService,
) => {
    const menuItemsService = new MenuItemsService(menuItemsRepository, vendorsService);
    const menuItemsController = new MenuItemsController(menuItemsService);

    const router = Router();

    router.post('', permissionsMiddleware.isVendor, menuItemsController.createMenuItem.bind(menuItemsController));
    router.get('/:vendorId/:menuItemId', menuItemsController.getMenuItem.bind(menuItemsController));
    router.get('/:vendorId', menuItemsController.listMenuItemsForVendor.bind(menuItemsController));
    router.patch(
        '/:vendorId/:menuItemId',
        permissionsMiddleware.isVendor,
        permissionsMiddleware.ownsVendorAccount,
        menuItemsController.updateMenuItem.bind(menuItemsController),
    );
    router.delete(
        '/:vendorId/:menuItemId',
        permissionsMiddleware.isVendor,
        permissionsMiddleware.ownsVendorAccount,
        menuItemsController.removeMenuItem.bind(menuItemsController),
    );

    return {
        router
    }
};

export default createMenuItemsModule;