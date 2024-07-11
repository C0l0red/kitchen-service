import Vendor from "./models/vendor.entity";
import Logger from "../common/logger";
import HttpError from "../common/errors/http.error";
import VendorDto, {mapToVendorDto, mapToVendorDtoList} from "./dto/vendor.dto";
import PagedRequestDto from "../common/dto/paged-request.dto";
import {DataSource} from "typeorm";
import UsersService from "../users/users.service";
import {CreateVendorDto} from "./dto/create-vendor.dto";
import {UserType} from "../users/model/user-type.enum";

export default class VendorsService {
    constructor(
        private readonly vendorsRepository: VendorsRepository,
        private readonly dataSource: DataSource,
        private readonly usersService: UsersService,
    ) {
    }

    async createVendor(createVendorDto: CreateVendorDto): Promise<VendorDto> {
        let vendor: Vendor;
        await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.findOneBy(Vendor, {businessName: createVendorDto.businessName}).then(vendor => {
                if (vendor) throw new HttpError("Business name taken already", 409);
            });

            const user = await this.usersService.createUser(createVendorDto, UserType.VENDOR, transactionalEntityManager);

            vendor = await transactionalEntityManager.save(Vendor, {
                businessName: createVendorDto.businessName,
                businessDescription: createVendorDto.businessDescription,
                user
            });
            Logger.log(`Vendor ${createVendorDto.businessName} created successfully`);
        });

        return mapToVendorDto(vendor!);
    }

    async listVendors(pagedRequest: PagedRequestDto): Promise<DtoListAndCount<Vendor>> {
        const [vendors, count] = await this.vendorsRepository.findAndCount({
            take: pagedRequest.pageSize,
            skip: (pagedRequest.page - 1) * pagedRequest.pageSize,
            order: {createdAt: -1},
            relations: {user: true}
        });

        return {
            entities: mapToVendorDtoList(vendors),
            count
        }
    }

    async getVendorDetails(where: Partial<Record<keyof Vendor, any>>): Promise<VendorDto> {
        return this.vendorsRepository
            .findOne({where, relations: {user: true}}).then(vendor => {
                if (!vendor) throw new HttpError("Vendor not found", 404);
                return mapToVendorDto(vendor);
            });
    }
}