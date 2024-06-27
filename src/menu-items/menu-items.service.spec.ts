import MenuItemsService from "./menu-items.service";
import {
    mockCreateMenuItemAlfredoDto,
    mockMenuItem,
    mockMenuItemsRepository,
    mockVendorsService
} from "../../tests/mocks";

describe('MenuItemsService', () => {
    let service: MenuItemsService;

    beforeEach(() => {
        service = new MenuItemsService(mockMenuItemsRepository, mockVendorsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createMenuItem', () => {
        beforeEach(() => {
            jest.spyOn(mockMenuItemsRepository, 'findOneBy').mockResolvedValueOnce(null);
        });

        it('should call findOneBy() and save() once each', async () => {
            await service.createMenuItem(1, mockCreateMenuItemAlfredoDto);

            expect(mockMenuItemsRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(mockMenuItemsRepository.save).toHaveBeenCalledTimes(1);
        });

        it('should resolve to a Dto<MenuItem>', async () => {
            const menuItemDto = await service.createMenuItem(1, mockCreateMenuItemAlfredoDto);

            expect(menuItemDto.id).toEqual(mockMenuItem.id);
        });
    });

    describe('listMenuItemsForVendor', () => {
        it('should call findAndCount() once', async () => {
            await service.listMenuItemsForVendor({page: 1, pageSize: 10}, 1);

            expect(mockMenuItemsRepository.findAndCount).toHaveBeenCalledTimes(1);
        });

        it('should resolve to a DtoListAndCount<MenuItem>', async () => {
            const dtoListandCount = await service.listMenuItemsForVendor({page: 1, pageSize: 10}, 1);

            expect(dtoListandCount.count).toEqual(1);
            expect(dtoListandCount.entities.length).toEqual(1);
        });
    });

    describe('getMenuItemDetails', () => {
        it('should call findOneBy() once', async () => {
            await service.getMenuItemDetails(1, 1);

            expect(mockMenuItemsRepository.findOneBy).toHaveBeenCalledTimes(1);
        });

        it('should resolve to a MenuItem', async () => {
            const menuItem = await service.getMenuItemDetails(1, 1);

            expect(menuItem.id).toEqual(mockMenuItem.id);
        });
    });

    describe('updateMenuItem', () => {
        it('should call update() once', async () => {
            await service.updateMenuItem(1, 1, mockCreateMenuItemAlfredoDto);

            expect(mockMenuItemsRepository.findOne).toHaveBeenCalledTimes(1);
            expect(mockMenuItemsRepository.update).toHaveBeenCalledTimes(1);
        });

        it('should throw if no rows are affected', async () => {
            jest.spyOn(mockMenuItemsRepository, 'update')
                .mockResolvedValueOnce({affected: 0} as any);

            await expect(service.updateMenuItem(1, 1, mockCreateMenuItemAlfredoDto))
                .rejects.toThrow('No Menu Item Found to Update');
        });
    });

    describe('removeMenuItem', () => {
        it('should call delete() once', async () => {
            await service.removeMenuItem(1, 1);

            expect(mockMenuItemsRepository.delete).toHaveBeenCalledTimes(1);
        });

        it('should throw if no rows are affected', async () => {
            jest.spyOn(mockMenuItemsRepository, 'delete')
                .mockResolvedValueOnce({affected: 0} as any);

            await expect(service.removeMenuItem(1, 1))
                .rejects.toThrow('No Menu Item Found to Delete');
        });
    });
});