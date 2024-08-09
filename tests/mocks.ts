import CreateMenuItemDto from "../src/menu-items/dto/create-menu-item.dto";
import LoginDto from "../src/auth/dto/login.dto";
import {CreateCustomerDto} from "../src/customers/dto/create-customer.dto";
import {CreateVendorDto} from "../src/vendors/dto/create-vendor.dto";


export const mockCreateVendorDto: CreateVendorDto = {
    email: "vendor@test.com",
    password: "password",
    businessName: "Test Business",
    businessDescription: "Test Business Description",
    phoneNumber: "08123456789",
};

export const mockCreateAltVendorDto: CreateVendorDto = {
    email: "alt.vendor@test.com",
    password: "password",
    businessName: "Alt Test Business",
    businessDescription: "Alt Test Business Description",
    phoneNumber: "08123456789",
};

export const mockCreateCustomerDto: CreateCustomerDto = {
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