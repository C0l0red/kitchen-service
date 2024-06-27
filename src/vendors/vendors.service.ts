import {RegisterVendorDto} from "../auth/dto/register.dto";
import Vendor from "./models/vendor.entity";
import {UserType} from "../users/model/user-type.enum";
import Logger from "../common/logger";
import HttpError from "../common/errors/http.error";
import VendorDto, {buildVendorDto, buildVendorListDto} from "./dto/vendor.dto";
import PagedRequestDto from "../common/dto/paged-request.dto";
import User from "../users/model/user.entity";
import {DataSource} from "typeorm";

export default class VendorsService {
    constructor(
        private readonly vendorsRepository: VendorsRepository,
        private readonly dataSource: DataSource
    ) {
    }

    async createVendor(registerVendorDto: RegisterVendorDto): Promise<void> {
        await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.findOneBy(Vendor, {businessName: registerVendorDto.businessName}).then(vendor => {
                if (vendor) throw new HttpError("Business name taken already", 409);
            });

            let user = transactionalEntityManager.create(User, {
                email: registerVendorDto.email,
                password: registerVendorDto.password,
                phoneNumber: registerVendorDto.phoneNumber,
                userType: UserType.VENDOR,
            });
            user = await transactionalEntityManager.save(user);
            Logger.log(`New user '${user.email}' created successfully`);

            await transactionalEntityManager.save(Vendor, {
                businessName: registerVendorDto.businessName,
                businessDescription: registerVendorDto.businessDescription,
                user
            });
            Logger.log(`Vendor ${registerVendorDto.businessName} created successfully`);
        });
    }

    async listVendors(pagedRequest: PagedRequestDto): Promise<DtoListAndCount<Vendor>> {
        const [vendors, count] = await this.vendorsRepository.findAndCount({
            take: pagedRequest.pageSize,
            skip: (pagedRequest.page - 1) * pagedRequest.pageSize,
            order: {createdAt: -1},
            relations: {user: true}
        });

        return {
            entities: buildVendorListDto(vendors),
            count
        }
    }

    async getVendorDetails(where: Partial<Record<keyof Vendor, any>>): Promise<VendorDto> {
        return this.vendorsRepository
            .findOne({where, relations: {user: true}}).then(vendor => {
                if (!vendor) throw new HttpError("Vendor not found", 404);
                return buildVendorDto(vendor);
            });
    }
}