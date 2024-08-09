import MenuItemsService from "./menu-items.service";
import {Request, Response, NextFunction} from "express";
import {mapToCreateMenuItemDto} from "./dto/create-menu-item.dto";
import AuthenticatedRequest from "../common/interfaces/authenticated-request";
import {mapToresponseDto} from "../common/dto/response.dto";
import {mapToPagedRequestDto} from "../common/dto/paged-request.dto";
import {mapToUpdateMenuItemDto} from "./dto/update-menu-item.dto";
import {mapToPagedResponseDto} from "../common/dto/paged-response.dto";
import {mapToMenuItemDto, mapToMenuItemDtoList} from "./dto/menu-item.dto";
import {mapToMenuItemListFilterDto} from "./dto/menu-item-list-filter.dto";

export default class MenuItemsController {
    constructor(private readonly menuItemsService: MenuItemsService) {
    }

    async createMenuItem(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = (request as AuthenticatedRequest).userId;
            const dto = await mapToCreateMenuItemDto(request.body);
            const menuItem = await this.menuItemsService.createMenuItem(userId, dto);
            const responseData = mapToresponseDto('Menu Item added successfully', menuItem, mapToMenuItemDto);

            response.status(201).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async listMenuItems(request: Request, response: Response, next: NextFunction) {
        try {
            const filterDto = await mapToMenuItemListFilterDto(request.query);
            const pagedRequest = await mapToPagedRequestDto(request.query);
            const entitiesAndCount = await this.menuItemsService.listMenuItems(pagedRequest, filterDto);
            const responseData = mapToPagedResponseDto(
                'Menu Items fetched successfully',
                entitiesAndCount,
                pagedRequest,
                mapToMenuItemDtoList
            );

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async getMenuItem(request: Request, response: Response, next: NextFunction) {
        try {
            const menuItemId = Number(request.params.menuItemId);
            const menuItem = await this.menuItemsService.getMenuItemDetails(menuItemId);
            const responseData = mapToresponseDto('Menu Item fetched successfully', menuItem, mapToMenuItemDto);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async updateMenuItem(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = (request as AuthenticatedRequest).userId;
            const itemId = Number(request.params.menuItemId);
            const dto = await mapToUpdateMenuItemDto(request.body);

            const menuItem = await this.menuItemsService.updateMenuItem(itemId, userId, dto);
            const responseData = mapToresponseDto('Menu Item updated successfully', menuItem, mapToMenuItemDto);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async removeMenuItem(request: Request, response: Response, next: NextFunction) {
        try {
            const itemId = Number(request.params.menuItemId);
            await this.menuItemsService.removeMenuItem(itemId);
            const responseData = mapToresponseDto('Menu Item deleted successfully');

            response.status(200).json(responseData)
        } catch (error) {
            next(error);
        }
    }
}