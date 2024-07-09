import HttpError from "../common/errors/http.error";
import CreateMenuItemDto from "./dto/create-menu-item.dto";
import UpdateMenuItemDto from "./dto/update-menu-item.dto";
import Logger from "../common/logger";
import {menuItemDtoMapper, menuItemListDtoMapper} from "./dto/menu-item.dto";
import MenuItem from "./models/menu-item.entity";
import PagedRequestDto from "../common/dto/paged-request.dto";
import VendorsService from "../vendors/vendors.service";

export default class MenuItemsService {
    constructor(
        private readonly menuItemsRepository: MenuItemsRepository,
        private readonly vendorsService: VendorsService
    ) {
    }

    async createMenuItem(userId: number, createMenuItemDto: CreateMenuItemDto) {
        const vendor = await this.vendorsService.getVendorDetails({user: {id: userId}});
        await this.menuItemsRepository.findOneBy({
            vendor: {id: vendor.id},
            name: createMenuItemDto.name
        }).then(menuItem => {
            if (menuItem) throw new HttpError('Duplicate Menu Item name for Vendor', 409);
        });

        const menuItem = await this.menuItemsRepository.save({
            ...createMenuItemDto,
            vendor: {id: vendor.id}
        });

        Logger.log(`Menu Item ${menuItem.name} added`);

        return menuItemDtoMapper(menuItem);
    }

    async listMenuItemsForVendor(pagedRequest: PagedRequestDto, vendorId?: number): Promise<DtoListAndCount<MenuItem>> {
        const where = vendorId ? {vendor: {id: vendorId}} : {};

        const [menuItems, count] = await this.menuItemsRepository.findAndCount({
            where,
            take: pagedRequest.pageSize,
            skip: (pagedRequest.page - 1) * pagedRequest.pageSize,
            order: {price: -1},
            relations: {vendor: true}
        });

        return {
            entities: menuItemListDtoMapper(menuItems),
            count
        }
    }

    async getMenuItemDetails(vendorId: number, itemId: number) {
        return this.menuItemsRepository.findOneBy({vendor: {id: vendorId}, id: itemId}).then(menuItem => {
            if (!menuItem) throw new HttpError('Menu Item Not Found', 404);
            return menuItem;
        });
    }

    async updateMenuItem(vendorId: number, itemId: number, updateMenuItemDto: UpdateMenuItemDto) {
        if (updateMenuItemDto.name) {
            await this.menuItemsRepository.findOne({
                where: {
                    name: updateMenuItemDto.name,
                    vendor: {id: vendorId}
                }
            }).then(menuItem => {
                if (menuItem && menuItem.id != itemId) {
                    throw new HttpError('Duplicate Menu Item name for Vendor', 409);
                }
            });
        }

        await this.menuItemsRepository.update({id: itemId, vendor: {id: vendorId}}, updateMenuItemDto).then(result => {
            if (result.affected! < 1) throw new HttpError('No Menu Item Found to Update', 404);
        });

        Logger.log(`Menu Item ${itemId} successfully updated`);

        const menuItem = await this.menuItemsRepository.findOne({where: {id: itemId}, relations: {vendor: true}});
        return menuItemDtoMapper(menuItem!);
    }

    async removeMenuItem(vendorId: number, itemId: number) {
        await this.menuItemsRepository.delete({id: itemId, vendor: {id: vendorId}}).then(result => {
            if (result.affected! < 1) throw new HttpError('No Menu Item Found to Delete', 404);
        });

        Logger.log(`Menu Item ${itemId} successfully deleted`);
    }
}