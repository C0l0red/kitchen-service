import VendorsService from "./vendors.service";
import {mockCreateVendorDto, mockCreateAltVendorDto} from "../../tests/mocks";
import {CreateVendorDto} from "./dto/create-vendor.dto";
import {dataSource} from "../../tests/data";
import Vendor from "./models/vendor.entity";
import UsersService from "../users/users.service";
import EncryptionService from "../common/encryption.service";
import User from "../users/model/user.entity";
import {DatabaseManager} from "../data-source";

describe('VendorsService', () => {
    let service: VendorsService;
    let vendorsRepository: VendorsRepository;
    let usersService: UsersService;
    const databaseManager = new DatabaseManager(dataSource);

    beforeEach(async () => {
        await databaseManager.initializeDatasource();
        vendorsRepository = databaseManager.getRepository(Vendor);
        usersService = new UsersService(databaseManager.getRepository(User));

        service = new VendorsService(vendorsRepository, dataSource, usersService);
    });

    afterEach(async () => {
        await databaseManager.destroyDatabase();
    });

    describe('createVendor', () => {
        const createVendorDto: CreateVendorDto = {
            email: 'email@test.com',
            password: 'password',
            businessName: 'Test Business',
            businessDescription: 'Test Business Description',
            phoneNumber: '08123456789'
        };

        it('should call generateHash() once and add a new vendor', async () => {
            const spyOnGenerateHash = jest.spyOn(EncryptionService, 'generateHash');

            await service.createVendor(createVendorDto);

            expect(spyOnGenerateHash).toHaveBeenCalledTimes(1);
            expect(spyOnGenerateHash).toHaveBeenCalledWith(createVendorDto.password);

            const vendor = await vendorsRepository.findOne({
                where: {businessName: createVendorDto.businessName},
                relations: ['user']
            });

            expect(vendor).toBeDefined();
            expect(vendor?.businessDescription).toEqual(createVendorDto.businessDescription);
            expect(vendor?.user).toBeDefined();
            expect(vendor?.user.email).toEqual(createVendorDto.email);
        });

        it("should throw if the business name is taken", async () => {
            await service.createVendor(createVendorDto);

            await expect(service.createVendor(createVendorDto))
                .rejects.toThrow("Business name taken already");
        });
    });

    describe('listVendors', () => {
        it('should call findAndCount() once', async () => {
            const spyOnFindAndCount = jest.spyOn(vendorsRepository, 'findAndCount');
            await service.listVendors({page: 1, pageSize: 10});

            expect(spyOnFindAndCount).toHaveBeenCalledTimes(1);
        });

        it('should resolve to an object of VendorDtos and a count', async () => {
            await service.createVendor(mockCreateVendorDto);

            const {entities, count} = await service.listVendors({page: 1, pageSize: 10});

            expect(count).toEqual(1);
            expect(entities).toHaveLength(1);
            expect(entities[0].businessName).toEqual(mockCreateVendorDto.businessName);
        });
    });

    describe('getVendorDetails', () => {
        it('should call findOne() once', async () => {
            await service.createVendor(mockCreateVendorDto);
            const spyOnFindOne = jest.spyOn(vendorsRepository, 'findOne');

            await service.getVendorDetails({id: 1});

            expect(spyOnFindOne).toHaveBeenCalledTimes(1);
        });

        it('should resolve to a vendor', async () => {
            await service.createVendor(mockCreateVendorDto);
            const vendor = await service.getVendorDetails({id: 1});

            expect(vendor.id).toEqual(1);
            expect(vendor.businessName).toEqual(mockCreateVendorDto.businessName);
        });


        it('should throw an error when no vendor is found', async () => {
            await expect(service.getVendorDetails({id: 1})).rejects.toThrow('Vendor not found');
        });
    });
});