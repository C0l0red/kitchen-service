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
    let usersRepository: UsersRepository;
    let vendorsRepository: VendorsRepository;
    let vendorsService: VendorsService;
    let usersService: UsersService;
    const databaseManager = new DatabaseManager(dataSource);
    let testMenuItem: MenuItem;
    let testUser: User;
    let testVendor: Vendor;

    const partialMenuItem: Partial<MenuItem> = {
        name: 'Hamburger',
        description: 'Burger with cheese and meat',
        price: 1000,
    };

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
        
        usersRepository = databaseManager.getRepository(User);
        vendorsRepository = databaseManager.getRepository(Vendor);

        testUser = await usersRepository.save(partialUser);
        testVendor = await vendorsRepository.save({...partialVendor, user: testUser});
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

    describe('listMenuItems', () => {
        it('should call findAndCount() once', async () => {
            const spyOnFindAndCount = jest.spyOn(menuItemsRepository, 'findAndCount');
            await service.listMenuItems({page: 1, pageSize: 10}, {vendorId: testVendor.id});

            expect(spyOnFindAndCount).toHaveBeenCalledTimes(1);
        });

        it('should resolve to a DtoListAndCount<MenuItem>', async () => {
            const dtoListandCount = await service.listMenuItems({page: 1, pageSize: 10}, {vendorId: testVendor.id});

            expect(dtoListandCount.count).toEqual(1);
            expect(dtoListandCount.entities.length).toEqual(1);
        });

        it('should filter by vendorId when passed', async () => {
            const user: Partial<User> = {
                email: 'test-user2@email.com',
                password: 'password',
                phoneNumber: '+2348123456789',
                userType: UserType.VENDOR
            };
            const vendor: Partial<Vendor> = {
                businessName: 'Test Business 2', // Create a new vendor to filter by
                businessDescription: 'Test Business Description',
            };
            const menuItems: Partial<MenuItem>[] = [ // Create new items for the new vendor
                {...partialMenuItem, name: 'Salad'},
                {...partialMenuItem, name: 'Rice'},
                {...partialMenuItem, name: 'Pasta'},
            ];

            const newUser = await usersRepository.save(user);
            const newVendor = await vendorsRepository.save({...vendor, user: newUser});
            const newMenuItems = await menuItemsRepository.save(menuItems.map(item => ({...item, vendor: newVendor})));

            const dtoListandCount = await service.listMenuItems({page: 1, pageSize: 10}, {vendorId: newVendor.id});

            expect(dtoListandCount.count).toEqual(newMenuItems.length); // Make sure the count matches with the new created items
        });
    });

    describe('getMenuItemDetails', () => {
        it('should call findOneBy() once', async () => {
            const spyOnFindOne = jest.spyOn(menuItemsRepository, 'findOne');
            const menuItem = await service.getMenuItemDetails(testMenuItem.id);

            expect(spyOnFindOne).toHaveBeenCalledTimes(1);
            expect(menuItem.name).toEqual(testMenuItem.name);
        });

        it('should resolve to a MenuItem', async () => {
            const menuItemEntity = await service.getMenuItemDetails(testMenuItem.id);

            expect(menuItemEntity.id).toEqual(testMenuItem.id);
            expect(menuItemEntity.name).toEqual(testMenuItem.name);
        });

        it('should throw an error if no menu item is found', async () => {
            await expect(service.getMenuItemDetails(testMenuItem.id + 2))
                .rejects.toThrow('Menu Item Not Found');
        });
    });

    describe('updateMenuItem', () => {
        it('should call update() once', async () => {
            const spyOnFindOne = jest.spyOn(menuItemsRepository, 'findOne');
            const spyOnUpdate = jest.spyOn(menuItemsRepository, 'update');

            const updateMenuItemDto: UpdateMenuItemDto = {name: 'Cheeseburger'}

            await service.updateMenuItem(testMenuItem.id, testUser.id, updateMenuItemDto);

            expect(spyOnFindOne).toHaveBeenCalledTimes(2);
            expect(spyOnUpdate).toHaveBeenCalledTimes(1);

            const menuItem = await menuItemsRepository.findOneBy({id: testMenuItem.id});

            expect(menuItem).toBeDefined();
            expect(menuItem?.name).toEqual(updateMenuItemDto.name);
        });

        it('should throw if no rows are affected', async () => {
            await expect(service.updateMenuItem(testMenuItem.id + 2, testUser.id, mockCreateMenuItemAlfredoDto))
                .rejects.toThrow('No Menu Item Found to Update');
        });
    });

    describe('removeMenuItem', () => {
        it('should call delete() once', async () => {
            const spyOnDelete = jest.spyOn(menuItemsRepository, 'delete');

            await service.removeMenuItem(testMenuItem.id);
            const menuItem = await menuItemsRepository.findOneBy({id: testMenuItem.id});

            expect(spyOnDelete).toHaveBeenCalledTimes(1);
            expect(menuItem).toBeNull();
        });

        it('should throw if no rows are affected', async () => {
            await expect(service.removeMenuItem(testMenuItem.id + 2))
                .rejects.toThrow('No Menu Item Found to Delete');
        });
    });
});