import MenuItemsService from "./menu-items.service";
import {Request, Response, NextFunction} from "express";
import {createMenuItemDtoMapper} from "./dto/create-menu-item.dto";
import AuthenticatedRequest from "../common/interfaces/authenticated-request";
import {responseDtoMapper} from "../common/dto/response.dto";
import {pagedRequestDtoMapper} from "../common/dto/paged-request.dto";
import {updateMenuItemDtoMapper} from "./dto/update-menu-item.dto";
import {pagedResponseDtoMapper} from "../common/dto/paged-response.dto";

export default class MenuItemsController {
    constructor(private readonly menuItemsService: MenuItemsService) {
    }

    async createMenuItem(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = (request as AuthenticatedRequest).userId;
            const dto = await createMenuItemDtoMapper(request.body);
            const data = await this.menuItemsService.createMenuItem(userId, dto);
            const responseData = responseDtoMapper('Menu Item added successfully', data);

            response.status(201).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async listAllMenuItems(request: Request, response: Response, next: NextFunction) {
        try {
            const pagedRequest = await pagedRequestDtoMapper(request.query);
            const data = await this.menuItemsService.listMenuItemsForVendor(pagedRequest);
            const responseData = pagedResponseDtoMapper('Menu Items fetched successfully', data, pagedRequest);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async listMenuItemsForVendor(request: Request, response: Response, next: NextFunction) {
        try {
            const vendorId = Number(request.params.vendorId);
            const pagedRequest = await pagedRequestDtoMapper(request.query);
            const data = await this.menuItemsService.listMenuItemsForVendor(pagedRequest, vendorId);
            const responseData = pagedResponseDtoMapper('Menu Items fetched successfully', data, pagedRequest);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async getMenuItem(request: Request, response: Response, next: NextFunction) {
        try {
            const menuItemId = Number(request.params.menuItemId);
            const vendorId = Number(request.params.vendorId);
            const data = await this.menuItemsService.getMenuItemDetails(vendorId, menuItemId);
            const responseData = responseDtoMapper('Menu Item fetched successfully', data);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async updateMenuItem(request: Request, response: Response, next: NextFunction) {
        try {
            const vendorId = Number(request.params.vendorId);
            const itemId = Number(request.params.menuItemId);
            const dto = await updateMenuItemDtoMapper(request.body);
            const data = await this.menuItemsService.updateMenuItem(vendorId, itemId, dto);
            const responseData = responseDtoMapper('Menu Item updated successfully', data);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async removeMenuItem(request: Request, response: Response, next: NextFunction) {
        try {
            const vendorId = Number(request.params.vendorId);
            const itemId = Number(request.params.menuItemId);
            const data = await this.menuItemsService.removeMenuItem(vendorId, itemId);
            const responseData = responseDtoMapper('Menu Item deleted successfully', data);

            response.status(200).json(responseData)
        } catch (error) {
            next(error);
        }
    }
}