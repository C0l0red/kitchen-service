import VendorsService from "./vendors.service";
import {
    mockVendorsRepository,
    mockVendor,
    mockRegisterVendorDto,
    mockDataSource
} from "../../tests/mocks";

describe('VendorsService', () => {
    let service: VendorsService;

    beforeEach(() => {
        service = new VendorsService(mockVendorsRepository, mockDataSource);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createVendor', () => {
        it('should run with no errors', async () => {
            // Couldn't figure out a way to mock a transaction
            await service.createVendor(mockRegisterVendorDto);
        });
    });

    describe('listVendors', () => {
        it('should call findAndCount once', async () => {
            await service.listVendors({page: 1, pageSize: 10});

            expect(mockVendorsRepository.findAndCount).toHaveBeenCalledTimes(1);
        });

        it('should resolve to an object of VendorDtos and a count', async () => {
            const {entities, count} = await service.listVendors({page: 1, pageSize: 10});

            expect(count).toEqual(1);
            expect(entities).toHaveLength(1);
            expect(entities[0].businessName).toEqual('Test Business');
        });
    });

    describe('getVendorDetails', () => {
        it('should call findOne() once', async () => {
            await service.getVendorDetails({id: 1});

            expect(mockVendorsRepository.findOne).toHaveBeenCalledTimes(1);
        });

        it('should resolve to a vendor', async () => {
            const vendor = await service.getVendorDetails({id: 1});

            expect(vendor.id).toEqual(mockVendor.id);
            expect(vendor).toHaveProperty('businessNumber')
        });
    });
});