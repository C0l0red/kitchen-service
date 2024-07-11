import MenuItemsService from "./menu-items.service";
import {mockCreateMenuItemAlfredoDto} from "../../tests/mocks";
import {DatabaseManager} from "../data-source";
import {dataSource} from "../../tests/data";
import MenuItem from "./models/menu-item.entity";
import VendorsService from "../vendors/vendors.service";
import Vendor from "../vendors/models/vendor.entity";
import UsersService from "../users/users.service";
import User from "../users/model/user.entity";
import {UserType} from "../users/model/user-type.enum";
import UpdateMenuItemDto from "./dto/update-menu-item.dto";

describe('MenuItemsService', () => {
    let service: MenuItemsService;
    let menuItemsRepository: MenuItemsRepository;
    let vendorsService: VendorsService;
    let usersService: UsersService;
    const databaseManager = new DatabaseManager(dataSource);
    let testMenuItem: MenuItem;
    let testUser: User;
    let testVendor: Vendor;

    beforeEach(async () => {
        await databaseManager.initializeDatasource();

        menuItemsRepository = databaseManager.getRepository(MenuItem);
        usersService = new UsersService(databaseManager.getRepository(User));
        vendorsService = new VendorsService(databaseManager.getRepository(Vendor), databaseManager.getDataSource(), usersService);

        service = new MenuItemsService(menuItemsRepository, vendorsService);
        await setupMenuItems();
    });

    afterEach(async () => {
        jest.clearAllMocks();
        await databaseManager.destroyDatabase();
    });

    const setupMenuItems = async () => {
        const partialUser: Partial<User> = {
            email: 'test@email.com',
            password: 'password',
            phoneNumber: '+2348123456789',
            userType: UserType.VENDOR
        };
        const partialVendor: Partial<Vendor> = {
            businessName: 'Test',
            businessDescription: 'User',
        };
        const partialMenuItem: Partial<MenuItem> = {
            name: 'Hamburger',
            description: 'Burger with cheese and meat',
            price: 1000,
        };

        const usersRepository = databaseManager.getRepository(User);
        const vendorRepository = databaseManager.getRepository(Vendor);

        testUser = await usersRepository.save(partialUser);
        testVendor = await vendorRepository.save({...partialVendor, user: testUser});
        testMenuItem = await menuItemsRepository.save({...partialMenuItem, vendor: testVendor});
    };

    describe('createMenuItem', () => {
        it('should call findOneBy() and save() once each', async () => {
            const spyOnFindOneBy = jest.spyOn(menuItemsRepository, 'findOneBy');
            const spyOnSave = jest.spyOn(menuItemsRepository, 'save');

            await service.createMenuItem(1, mockCreateMenuItemAlfredoDto);

            expect(spyOnFindOneBy).toHaveBeenCalledTimes(1);
            expect(spyOnSave).toHaveBeenCalledTimes(1);
        });

        it('should resolve to a Dto<MenuItem>', async () => {
            const menuItemDto = await service.createMenuItem(testUser.id, mockCreateMenuItemAlfredoDto);

            expect(menuItemDto.id).toEqual(testMenuItem.id + 1);
            expect(menuItemDto.name).toEqual(mockCreateMenuItemAlfredoDto.name);
        });
    });

    describe('listMenuItemsForVendor', () => {
        it('should call findAndCount() once', async () => {
            const spyOnFindAndCount = jest.spyOn(menuItemsRepository, 'findAndCount');
            await service.listMenuItems({page: 1, pageSize: 10}, 1);

            expect(spyOnFindAndCount).toHaveBeenCalledTimes(1);
        });

        it('should resolve to a DtoListAndCount<MenuItem>', async () => {
            const dtoListandCount = await service.listMenuItems({page: 1, pageSize: 10}, 1);

            expect(dtoListandCount.count).toEqual(1);
            expect(dtoListandCount.entities.length).toEqual(1);
        });
    });

    describe('getMenuItemDetails', () => {
        it('should call findOneBy() once', async () => {
            const spyOnFindOne = jest.spyOn(menuItemsRepository, 'findOne');
            const menuItem = await service.getMenuItemDetails(testVendor.id, testMenuItem.id);

            expect(spyOnFindOne).toHaveBeenCalledTimes(1);
            expect(menuItem.name).toEqual(testMenuItem.name);
        });

        it('should resolve to a MenuItem', async () => {
            const menuItemEntity = await service.getMenuItemDetails(testVendor.id, testMenuItem.id);

            expect(menuItemEntity.id).toEqual(testMenuItem.id);
            expect(menuItemEntity.name).toEqual(testMenuItem.name);
        });

        it('should throw an error if no menu item is found', async () => {
            await expect(service.getMenuItemDetails(testVendor.id, testMenuItem.id + 2))
                .rejects.toThrow('Menu Item Not Found');
        });
    });

    describe('updateMenuItem', () => {
        it('should call update() once', async () => {
            const spyOnFindOne = jest.spyOn(menuItemsRepository, 'findOne');
            const spyOnUpdate = jest.spyOn(menuItemsRepository, 'update');

            const updateMenuItemDto: UpdateMenuItemDto = {name: 'Cheeseburger'}

            await service.updateMenuItem(testVendor.id, testMenuItem.id, updateMenuItemDto);

            expect(spyOnFindOne).toHaveBeenCalledTimes(2);
            expect(spyOnUpdate).toHaveBeenCalledTimes(1);

            const menuItem = await menuItemsRepository.findOneBy({id: testMenuItem.id});

            expect(menuItem).toBeDefined();
            expect(menuItem?.name).toEqual(updateMenuItemDto.name);
        });

        it('should throw if no rows are affected', async () => {
            await expect(service.updateMenuItem(testVendor.id, testMenuItem.id + 2, mockCreateMenuItemAlfredoDto))
                .rejects.toThrow('No Menu Item Found to Update');
        });
    });

    describe('removeMenuItem', () => {
        it('should call delete() once', async () => {
            const spyOnDelete = jest.spyOn(menuItemsRepository, 'delete');

            await service.removeMenuItem(testVendor.id, testMenuItem.id);
            const menuItem = await menuItemsRepository.findOneBy({id: testMenuItem.id});

            expect(spyOnDelete).toHaveBeenCalledTimes(1);
            expect(menuItem).toBeNull();
        });

        it('should throw if no rows are affected', async () => {
            await expect(service.removeMenuItem(testVendor.id, testMenuItem.id + 2))
                .rejects.toThrow('No Menu Item Found to Delete');
        });
    });
});