import request from "supertest";
import ExpressApp from "../src/app";

import {Express} from "express";
import {dataSource} from "./data";
import {
    mockCreateMenuItemAlfredoDto, mockCreateMenuItemGizdodoDto, mockCreateMenuItemPizzaDto, mockLoginDtoForAltVendor,
    mockLoginDtoForCustomer,
    mockLoginDtoForVendor, mockCreateAltVendorDto,
    mockCreateCustomerDto,
    mockCreateVendorDto
} from "./mocks";
import UpdateMenuItemDto from "../src/menu-items/dto/update-menu-item.dto";
import LoginDto from "../src/auth/dto/login.dto";
import {CreateVendorDto} from "../src/vendors/dto/create-vendor.dto";
import {DatabaseManager} from "../src/data-source";

describe('Menu Items Resource', () => {
    let expressApp: ExpressApp;
    let app: Express
    let customerAuthHeader: string;
    let vendorAuthHeader: string;
    let altVendorAuthHeader: string;

    beforeEach(async () => {
        const databaseManager = new DatabaseManager(dataSource);
        expressApp = new ExpressApp(databaseManager);
        await expressApp.initializeApp();
        app = expressApp.getApp();

        vendorAuthHeader = await setupVendor(mockCreateVendorDto, mockLoginDtoForVendor);
        altVendorAuthHeader = await setupVendor(mockCreateAltVendorDto, mockLoginDtoForAltVendor);
        await setupCustomer();
        await setupMenuItems();
    });

    const setupVendor = async (registerDto: CreateVendorDto, loginDto: LoginDto) => {
        await request(app)
            .post('/vendors')
            .set('Accept', 'application/json')
            .send(registerDto)
            .expect(201);

        const loginResponse = await request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send(loginDto);

        expect(loginResponse.status).toEqual(200);
        expect(loginResponse.body.data).toHaveProperty("token");

        return `Bearer ${loginResponse.body.data.token}`;
    };

    const setupCustomer = async () => {
        await request(app)
            .post('/customers')
            .set('Accept', 'application/json')
            .send(mockCreateCustomerDto)
            .expect(201);

        const loginResponse = await request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send(mockLoginDtoForCustomer);

        expect(loginResponse.status).toEqual(200);
        expect(loginResponse.body.data).toHaveProperty("token");

        customerAuthHeader = `Bearer ${loginResponse.body.data.token}`;
    };

    const setupMenuItems = async () => {
        await request(app)
            .post('/menu-items')
            .set('Accept', 'application/json')
            .set('Authorization', vendorAuthHeader)
            .send(mockCreateMenuItemAlfredoDto)
            .expect(201);

        await request(app)
            .post('/menu-items')
            .set('Accept', 'application/json')
            .set('Authorization', vendorAuthHeader)
            .send(mockCreateMenuItemPizzaDto)
            .expect(201);
    };

    afterEach(() => {
        expressApp.destroyDatabase();
    });

    describe('POST /menu-items', () => {
        it('should add a new menu item', async () => {
            await request(app)
                .post('/menu-items')
                .set('Accept', 'application/json')
                .set('Authorization', vendorAuthHeader)
                .send(mockCreateMenuItemGizdodoDto)
                .expect(201);

            const response = await request(app)
                .get('/menu-items/3')
                .set('Accept', 'application/json')
                .set('Authorization', vendorAuthHeader)
                .expect(200);

            expect(response.body.data.name)
                .toEqual(mockCreateMenuItemGizdodoDto.name);
        });

        it('should respond with a 409 upon duplicate item name in same store', async () => {
            await request(app)
                .post('/menu-items')
                .set('Accept', 'application/json')
                .set('Authorization', vendorAuthHeader)
                .send(mockCreateMenuItemPizzaDto)
                .expect(409);
        });

        it('should allow duplicate names in different stores', async () => {
            await request(app)
                .post('/menu-items')
                .set('Accept', 'application/json')
                .set('Authorization', altVendorAuthHeader)
                .send(mockCreateMenuItemPizzaDto)
                .expect(201);
        });
    });

    describe('GET /menu-items/:menuItemId', () => {
        it('should respond with an exising menu item', async () => {
            const response = await request(app)
                .get('/menu-items/1')
                .set('Accept', 'application/json')
                .set('Authorization', customerAuthHeader)
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body.data.name).toEqual(mockCreateMenuItemAlfredoDto.name)
        });

        it('should respond with a 404 for a non-existent menu item', async () => {
            await request(app)
                .get('/menu-items/4')
                .set('Accept', 'application/json')
                .set('Authorization', customerAuthHeader)
                .expect(404);
        });
    });

    describe('PATCH /menu-items/:menuItemId', () => {
        it('should update a menu item', async () => {
            const updateMenuItemDto: UpdateMenuItemDto = {
                name: 'Updated Name'
            };

            await request(app)
                .patch('/menu-items/1')
                .set('Accept', 'application/json')
                .set('Authorization', vendorAuthHeader)
                .send(updateMenuItemDto)
                .expect(200);

            const response = await request(app)
                .get('/menu-items/1')
                .set('Accept', 'application/json')
                .set('Authorization', vendorAuthHeader)
                .expect(200);

            expect(response.body.data.name).toEqual(updateMenuItemDto.name);
        });

        it('should respond with a 409 upon duplicate item name in same store', async () => {
            const updateMenuItemDto: UpdateMenuItemDto = {
                name: mockCreateMenuItemPizzaDto.name // Name already exists for same Vendor
            };

            await request(app)
                .patch('/menu-items/1')
                .set('Accept', 'application/json')
                .set('Authorization', vendorAuthHeader)
                .send(updateMenuItemDto)
                .expect(409);
        });

        it('should allow update to an existing item name in a different store', async () => {
            await request(app)
                .post('/menu-items')
                .set('Accept', 'application/json')
                .set('Authorization', altVendorAuthHeader)
                .send(mockCreateMenuItemGizdodoDto)
                .expect(201);

            await request(app)
                .patch('/menu-items/3')
                .set('Accept', 'application/json')
                .set('Authorization', altVendorAuthHeader)
                .send(mockCreateMenuItemPizzaDto) // Already exists for vendor 1
                .expect(200);
        });

        it('should respond with a 403 for an unpermitted user', async () => {
            await request(app)
                .patch('/menu-items/1') // VendorId for main vendor
                .set('Accept', 'application/json')
                .set('Authorization', altVendorAuthHeader)
                .send(mockCreateMenuItemAlfredoDto)
                .expect(403);
        });
    });

    describe('DELETE /menu-items/:menuItemId', () => {
        it('should delete a menu item', async () => {
            await request(app)
                .delete('/menu-items/1')
                .set('Accept', 'application/json')
                .set('Authorization', vendorAuthHeader)
                .expect(200);

            await request(app)
                .get('/menu-items/1')
                .set('Accept', 'application/json')
                .set('Authorization', vendorAuthHeader)
                .expect(404);
        });

        it('should respond with a 404 for an already deleted menu item', async () => {
            await request(app)
                .delete('/menu-items/1')
                .set('Accept', 'application/json')
                .set('Authorization', vendorAuthHeader)
                .expect(200);

            await request(app)
                .delete('/menu-items/1')
                .set('Accept', 'application/json')
                .set('Authorization', vendorAuthHeader)
                .expect(404);
        });

        it('should respond with a 403 for an unpermitted user', async () => {
            await request(app)
                .delete('/menu-items/1') // VendorId for main vendor
                .set('Accept', 'application/json')
                .set('Authorization', altVendorAuthHeader)
                .expect(403);
        });
    });
});