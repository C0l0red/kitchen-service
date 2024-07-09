import request from "supertest";
import ExpressApp from "../src/app";

import {Express} from "express";
import {dataSource} from "./data";
import {mockLoginDtoForCustomer, mockLoginDtoForVendor, mockCreateCustomerDto, mockCreateVendorDto} from "./mocks";

describe("Auth Resource", () => {
    let expressApp: ExpressApp;
    let app: Express

    beforeEach(async () => {
        expressApp = new ExpressApp(dataSource);
        await expressApp.initializeApp();
        app = expressApp.getApp();
    });

    afterEach(() => {
        expressApp.destroyDatabase();
    });

    describe("POST /auth/register-vendor", () => {
        it("should respond with 200", async () => {
            const response = await request(app)
                .post('/auth/register-vendor')
                .set('Accept', 'application/json')
                .send(mockCreateVendorDto);

            expect(response.status).toEqual(201);
            expect(response.body).toHaveProperty("message");
        });

        it("should not allow duplicate usernames", async () => {
            const response = await request(app)
                .post('/auth/register-vendor')
                .set('Accept', 'application/json')
                .send(mockCreateVendorDto);

            expect(response.status).toEqual(201);

            const secondResponse = await request(app)
                .post('/auth/register-vendor')
                .set('Accept', 'application/json')
                .send(mockCreateVendorDto);

            expect(secondResponse.status).toEqual(409);
        });
    });

    describe("POST /auth/register-customer", () => {
        it("should respond with 200", async () => {
            const response = await request(app)
                .post('/auth/register-customer')
                .set('Accept', 'application/json')
                .send(mockCreateCustomerDto);

            expect(response.status).toEqual(201);
            expect(response.body).toHaveProperty("message");
        });

        it("should not allow duplicate emails", async () => {
            const response = await request(app)
                .post('/auth/register-customer')
                .set('Accept', 'application/json')
                .send(mockCreateCustomerDto);

            expect(response.status).toEqual(201);

            const secondResponse = await request(app)
                .post('/auth/register-customer')
                .set('Accept', 'application/json')
                .send(mockCreateCustomerDto);

            expect(secondResponse.status).toEqual(409);
        });
    });

    describe("POST /auth/login", () => {
        it("should return an auth token on correct credentials", async () => {
            const registrationResponse = await request(app)
                .post('/auth/register-customer')
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
                .post('/auth/register-vendor')
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