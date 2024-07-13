import {Router} from "express";
import MenuItemsService from "./menu-items.service";
import MenuItemsController from "./menu-items.controller";
import PermissionsMiddleware from "../middleware/permissions.middleware";
import VendorsService from "../vendors/vendors.service";

const createMenuItemsModule = (
    menuItemsRepository: MenuItemsRepository,
    permissionsMiddleware: PermissionsMiddleware,
    authorizationMiddleware: Middleware,
    vendorsService: VendorsService,
) => {
    const menuItemsService = new MenuItemsService(menuItemsRepository, vendorsService);
    const menuItemsController = new MenuItemsController(menuItemsService);

    const router = Router();

    router.post('', authorizationMiddleware, permissionsMiddleware.isVendor, menuItemsController.createMenuItem.bind(menuItemsController));
    router.get('/:menuItemId', authorizationMiddleware, menuItemsController.getMenuItem.bind(menuItemsController));
    router.get('', authorizationMiddleware, menuItemsController.listMenuItems.bind(menuItemsController));
    router.patch(
        '/:menuItemId',
        authorizationMiddleware,
        permissionsMiddleware.isVendor,
        permissionsMiddleware.ownsMenuItem,
        menuItemsController.updateMenuItem.bind(menuItemsController),
    );
    router.delete(
        '/:menuItemId',
        authorizationMiddleware,
        permissionsMiddleware.isVendor,
        permissionsMiddleware.ownsMenuItem,
        menuItemsController.removeMenuItem.bind(menuItemsController),
    );

    return {
        router
    }
};

export default createMenuItemsModule;