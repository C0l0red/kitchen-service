import request from "supertest";
import ExpressApp from "../src/app";

import {Express} from "express";
import {dataSource} from "./data";
import {mockLoginDtoForCustomer, mockRegisterCustomerDto, mockRegisterVendorDto} from "./mocks";

describe('Vendors Resource', () => {
    let expressApp: ExpressApp;
    let app: Express
    let authHeader: string;

    const setupVendor = async () => {
        await request(app)
            .post('/auth/register-vendor')
            .set('Accept', 'application/json')
            .send(mockRegisterVendorDto)
            .expect(201);
    };

    const setAuthHeader = async () => {
        await request(app)
            .post('/auth/register-customer')
            .set('Accept', 'application/json')
            .send(mockRegisterCustomerDto)
            .expect(201);

        const loginResponse = await request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send(mockLoginDtoForCustomer);

        expect(loginResponse.status).toEqual(200);
        expect(loginResponse.body.data).toHaveProperty("token");

        authHeader = `Bearer ${loginResponse.body.data.token}`;
    };

    beforeEach(async () => {
        expressApp = new ExpressApp(dataSource);
        await expressApp.initializeApp();
        app = expressApp.getApp();

        await setupVendor();
        await setAuthHeader();
    });

    afterEach(() => {
        expressApp.destroyDatabase();
    });

    describe('GET /vendors', () => {
        it('should respond with a list of vendors', async () => {
            const response = await request(app)
                .get('/vendors')
                .set('Accept', 'application/json')
                .set('Authorization', authHeader);

            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty('totalItems');
            expect(response.body).toHaveProperty('totalPages');
            expect(response.body).toHaveProperty('data');
            expect(response.body.totalItems).toEqual(1);
            expect(response.body.totalPages).toEqual(1);
            expect(response.body.data[0].businessName).toEqual(mockRegisterVendorDto.businessName);
        });
    });

    describe('GET /vendors/:vendorId', () => {
        it('should respond with a vendor details', async () => {
            const response = await request(app)
                .get('/vendors/1')
                .set('Accept', 'application/json')
                .set('Authorization', authHeader);

            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data.businessName).toEqual(mockRegisterVendorDto.businessName);
        });

        it('should respond with a 404 upon invalid vendorId', async () => {
            await request(app)
                .get('/vendors/2')
                .set('Accept', 'application/json')
                .set('Authorization', authHeader).expect(404);
        });
    });
});