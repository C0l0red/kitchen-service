import MenuItem from "../models/menu-item.entity";

export default class MenuItemDto implements Dto<MenuItem> {
    id: number;
    name: string;
    description: string;
    price: number;
}

export function buildMenuItemDto(menuItem: MenuItem): MenuItemDto {
    return {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price
    }
}

export function buildMenuItemListDto(menuItems: MenuItem[]) {
    return menuItems.map(buildMenuItemDto);
}