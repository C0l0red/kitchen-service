import Vendor from "../src/vendors/models/vendor.entity";
import User from "../src/users/model/user.entity";
import UsersService from "../src/users/users.service";
import {UserType} from "../src/users/model/user-type.enum";
import Customer from "../src/customers/models/customer.entity";
import VendorsService from "../src/vendors/vendors.service";
import CustomersService from "../src/customers/customers.service";
import MenuItem from "../src/menu-items/models/menu-item.entity";
import CreateMenuItemDto from "../src/menu-items/dto/create-menu-item.dto";
import {RegisterCustomerDto, RegisterVendorDto} from "../src/auth/dto/register.dto";
import LoginDto from "../src/auth/dto/login.dto";
import {DataSource, EntityManager} from "typeorm";


type MockUsersRepository = jest.Mocked<UsersRepository>;
type MockCustomersRepository = jest.Mocked<CustomersRepository>;
type MockVendorsRepository = jest.Mocked<VendorsRepository>;
type MockMenuItemsRepository = jest.Mocked<MenuItemsRepository>;

export const mockRegisterVendorDto: RegisterVendorDto = {
    email: "vendor@test.com",
    password: "password",
    businessName: "Test Business",
    businessDescription: "Test Business Description",
    phoneNumber: "08123456789",
};

export const mockRegisterAltVendorDto: RegisterVendorDto = {
    email: "alt.vendor@test.com",
    password: "password",
    businessName: "Alt Test Business",
    businessDescription: "Alt Test Business Description",
    phoneNumber: "08123456789",
};

export const mockRegisterCustomerDto: RegisterCustomerDto = {
    email: 'customer@test.com',
    password: 'password',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '08123456789'
}

export const mockLoginDtoForVendor: LoginDto = {
    email: 'vendor@test.com',
    password: 'password'
}

export const mockLoginDtoForAltVendor: LoginDto = {
    email: 'alt.vendor@test.com',
    password: 'password'
}

export const mockLoginDtoForCustomer: LoginDto = {
    email: 'customer@test.com',
    password: 'password'
}

export const mockCreateMenuItemAlfredoDto: CreateMenuItemDto = {
    name: 'Alfredo',
    description: 'Special Pasta',
    price: 5000.00,
};

export const mockCreateMenuItemPizzaDto: CreateMenuItemDto = {
    name: 'Pizza',
    description: 'Double Decker Cheese Pizza',
    price: 12400.50,
}

export const mockCreateMenuItemGizdodoDto: CreateMenuItemDto = {
    name: 'Gizdodo',
    description: 'Peppered Gizzard and Plantains',
    price: 12400.50,
}

export const mockUser: User = {
    id: 1,
    email: 'email@test.com',
    password: 'password',
    phoneNumber: '',
    userType: UserType.CUSTOMER
}

export const mockVendor: Vendor = {
    id: 1,
    businessName: 'Test Business',
    businessDescription: 'Does test businesses',
    createdAt: new Date(),
    user: mockUser
};

export const mockCustomer: Customer = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    user: mockUser
}

export const mockMenuItem: MenuItem = {
    id: 1,
    name: 'Southern Fried Chicken',
    description: 'Crunchy golden brown fried chicken',
    price: 500.00,
    vendor: mockVendor,
}

const mockEntityManager: jest.Mocked<EntityManager> = {
    findOneBy: jest.fn(),
    save: jest.fn()
} as unknown as jest.Mocked<EntityManager>;

export const mockDataSource: jest.Mocked<DataSource> = {
    manager: {
        transaction: jest.fn().mockImplementation(<T>(runInTransaction: (entityManager: EntityManager) => Promise<T>) => Promise<void>)
    }
} as unknown as jest.Mocked<DataSource>;

export const mockUsersRepository: MockUsersRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn().mockResolvedValue({id: 1, username: 'Test'})
} as unknown as MockUsersRepository;

export const mockVendorsRepository: MockVendorsRepository = {
    save: jest.fn().mockImplementation(),
    findOneBy: jest.fn().mockResolvedValue(mockVendor),
    findOne: jest.fn().mockResolvedValue(mockVendor),
    findAndCount: jest.fn().mockResolvedValue([[mockVendor], 1])
} as unknown as MockVendorsRepository;

export const mockCustomersRepository: MockCustomersRepository = {
    save: jest.fn().mockImplementation(),
} as unknown as MockCustomersRepository;

export const mockMenuItemsRepository: MockMenuItemsRepository = {
    save: jest.fn().mockResolvedValue(mockMenuItem),
    findAndCount: jest.fn().mockResolvedValue([[mockMenuItem], 1]),
    findOneBy: jest.fn().mockResolvedValue(mockMenuItem),
    findOne: jest.fn().mockResolvedValue(mockMenuItem),
    update: jest.fn().mockResolvedValue({affected: 1}),
    delete: jest.fn().mockResolvedValue({affected: 1}),
} as unknown as MockMenuItemsRepository;

export const mockUsersService: jest.Mocked<UsersService> = {
    createUser: jest.fn().mockResolvedValue(mockUser),
    findUserByEmail: jest.fn().mockResolvedValue(mockUser),
    findUserById: jest.fn().mockResolvedValue(mockUser),
    getProfile: jest.fn().mockResolvedValue(mockUser),
} as unknown as jest.Mocked<UsersService>;

export const mockVendorsService: jest.Mocked<VendorsService> = {
    createVendor: jest.fn().mockResolvedValue(mockVendor),
    listVendors: jest.fn().mockResolvedValue([mockVendor]),
    getVendorDetails: jest.fn().mockResolvedValue(mockVendor)
} as unknown as jest.Mocked<VendorsService>;

export const mockCustomersService: jest.Mocked<CustomersService> = {
    createCustomer: jest.fn().mockResolvedValue(mockCustomer)
} as unknown as jest.Mocked<CustomersService>;