import HttpError from "../common/errors/http.error";
import CreateMenuItemDto from "./dto/create-menu-item.dto";
import UpdateMenuItemDto from "./dto/update-menu-item.dto";
import Logger from "../common/logger";
import MenuItem from "./models/menu-item.entity";
import PagedRequestDto from "../common/dto/paged-request.dto";
import VendorsService from "../vendors/vendors.service";
import MenuItemListFilterDto from "./dto/menu-item-list-filter.dto";

export default class MenuItemsService {
    constructor(
        private readonly menuItemsRepository: MenuItemsRepository,
        private readonly vendorsService: VendorsService
    ) {
    }

    async createMenuItem(userId: number, createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
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

        return menuItem;
    }

    async listMenuItems(pagedRequest: PagedRequestDto, filterDto: MenuItemListFilterDto): Promise<EntityListAndCount<MenuItem>> {
        const where = {
            ...(filterDto.vendorId && {vendor: {id: filterDto.vendorId}}), //Object spreading with a conditional property
        };

        const [menuItems, count] = await this.menuItemsRepository.findAndCount({
            where,
            take: pagedRequest.pageSize,
            skip: (pagedRequest.page - 1) * pagedRequest.pageSize,
            order: {price: -1},
            relations: {vendor: true}
        });

        return {
            entities: menuItems,
            count
        }
    }

    async getMenuItemDetails(itemId: number): Promise<MenuItem> {
        return this.menuItemsRepository.findOne({
            where: {id: itemId},
            relations: ['vendor']
        }).then(menuItem => {
            if (!menuItem) throw new HttpError('Menu Item Not Found', 404);
            return menuItem;
        });
    }

    async updateMenuItem(itemId: number, userId: number, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
        if (updateMenuItemDto.name) {
            await this.menuItemsRepository.findOne({
                where: {
                    name: updateMenuItemDto.name,
                    vendor: {user: {id: userId}},
                }
            }).then(menuItem => {
                if (menuItem && menuItem.id != itemId) {
                    throw new HttpError('Duplicate Menu Item name for Vendor', 409);
                }
            });
        }

        await this.menuItemsRepository.update({id: itemId}, updateMenuItemDto).then(result => {
            if (result.affected! < 1) throw new HttpError('No Menu Item Found to Update', 404);
        });

        Logger.log(`Menu Item ${itemId} successfully updated`);

        return this.menuItemsRepository.findOne({where: {id: itemId}, relations: {vendor: true}}).then(menuItem => {
            if (!menuItem) throw new HttpError('Menu Item Not Found', 404);
            return menuItem;
        });
    }

    async removeMenuItem(itemId: number): Promise<void> {
        await this.menuItemsRepository.delete({id: itemId}).then(result => {
            if (result.affected! < 1) throw new HttpError('No Menu Item Found to Delete', 404);
        });

        Logger.log(`Menu Item ${itemId} successfully deleted`);
    }
}