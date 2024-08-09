import request from "supertest";
import ExpressApp from "../src/app";

import {Express} from "express";
import {dataSource} from "./data";
import {mockLoginDtoForCustomer, mockCreateCustomerDto, mockCreateVendorDto} from "./mocks";
import { DatabaseManager } from "../src/data-source";

describe('Vendors Resource', () => {
    let expressApp: ExpressApp;
    let app: Express

    beforeEach(async () => {
        const databaseManager = new DatabaseManager(dataSource);
        expressApp = new ExpressApp(databaseManager);
        await expressApp.initializeApp();
        app = expressApp.getApp();
    });

    afterEach(() => {
        expressApp.destroyDatabase();
    });

    describe("POST /vendors", () => {
        it("should respond with 200", async () => {
            const response = await request(app)
                .post('/vendors')
                .set('Accept', 'application/json')
                .send(mockCreateVendorDto);

            expect(response.status).toEqual(201);
            expect(response.body).toHaveProperty("message");
        });

        it("should not allow duplicate usernames", async () => {
            const response = await request(app)
                .post('/vendors')
                .set('Accept', 'application/json')
                .send(mockCreateVendorDto);

            expect(response.status).toEqual(201);

            const secondResponse = await request(app)
                .post('/vendors')
                .set('Accept', 'application/json')
                .send(mockCreateVendorDto);

            expect(secondResponse.status).toEqual(409);
        });
    });

    describe("Authenticated Routes", () => {
        let authHeader: string;

        const setupVendor = async () => {
            await request(app)
                .post('/vendors')
                .set('Accept', 'application/json')
                .send(mockCreateVendorDto)
                .expect(201);
        };

        const setAuthHeader = async () => {
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

            authHeader = `Bearer ${loginResponse.body.data.token}`;
        };

        beforeEach(async () => {
            await setupVendor();
            await setAuthHeader();
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
                expect(response.body.data[0].businessName).toEqual(mockCreateVendorDto.businessName);
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
                expect(response.body.data.businessName).toEqual(mockCreateVendorDto.businessName);
            });

            it('should respond with a 404 upon invalid vendorId', async () => {
                await request(app)
                    .get('/vendors/2')
                    .set('Accept', 'application/json')
                    .set('Authorization', authHeader).expect(404);
            });
        });
    });
});