import Vendor from "../models/vendor.entity";

export default class VendorDto implements Dto<Vendor> {
    id: number;
    businessName: string;
    businessDescription: string;
    businessNumber?: string;
}

export function mapToVendorDto(vendor: Vendor): VendorDto {
    return {
        id: vendor.id,
        businessName: vendor.businessName,
        businessDescription: vendor.businessDescription,
        businessNumber: vendor.user?.phoneNumber,
    };
}

export function mapToVendorDtoList(vendors: Vendor[]): VendorDto[] {
    return vendors.map(mapToVendorDto);
}