import MenuItem from "../models/menu-item.entity";

export default class MenuItemDto implements Dto<MenuItem> {
    id: number;
    name: string;
    description: string;
    price: number;
    vendorId: number
}

export function mapToMenuItemDto(menuItem: MenuItem): MenuItemDto {
    return {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        vendorId: menuItem.vendor.id,
    }
}

export function mapToMenuItemDtoList(menuItems: MenuItem[]) {
    return menuItems.map(mapToMenuItemDto);
}