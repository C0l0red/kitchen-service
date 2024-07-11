import request from "supertest";
import ExpressApp from "../src/app";

import {Express} from "express";
import {dataSource} from "./data";
import {mockLoginDtoForCustomer, mockLoginDtoForVendor, mockCreateCustomerDto, mockCreateVendorDto} from "./mocks";
import {DatabaseManager} from "../src/data-source";

describe("Auth Resource", () => {
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


    describe("POST /auth/login", () => {
        it("should return an auth token on correct credentials", async () => {
            const registrationResponse = await request(app)
                .post('/customers')
                .set('Accept', 'application/json')
                .send(mockCreateCustomerDto);

            expect(registrationResponse.status).toEqual(201);

            const loginResponse = await request(app)
                .post('/auth/login')
                .set('Accept', 'application/json')
                .send(mockLoginDtoForCustomer);

            expect(loginResponse.status).toEqual(200);
            expect(loginResponse.body).toBeDefined();
            expect(loginResponse.body.data).toBeDefined();
            expect(loginResponse.body.data).toHaveProperty("token");
        });

        it("should return a 401 on incorrect credentials", async () => {
            const registrationResponse = await request(app)
                .post('/vendors')
                .set('Accept', 'application/json')
                .send(mockCreateVendorDto);

            expect(registrationResponse.status).toEqual(201);

            const loginResponse = await request(app)
                .post('/auth/login')
                .set('Accept', 'application/json')
                .send({...mockLoginDtoForVendor, password: 'Incorrect password'});

            expect(loginResponse.status).toEqual(401);
        });
    });
});