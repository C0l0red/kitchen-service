import {mapToPagedRequestDto} from "../common/dto/paged-request.dto";
import VendorsService from "./vendors.service";
import {Request, Response, NextFunction} from "express";
import {mapToPagedResponseDto} from "../common/dto/paged-response.dto";
import {mapToresponseDto} from "../common/dto/response.dto";
import {CreateVendorDto, mapToCreateVendorDto} from "./dto/create-vendor.dto";
import {mapToVendorDto, mapToVendorDtoList} from "./dto/vendor.dto";

export default class VendorsController {
    constructor(private readonly vendorsService: VendorsService) {
    }

    async createVendor(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: CreateVendorDto = await mapToCreateVendorDto(request.body);
            const vendor = await this.vendorsService.createVendor(dto);
            const responseData = mapToresponseDto("Vendor created successful", vendor, mapToVendorDto);

            response.status(201).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async listVendors(request: Request, response: Response, next: NextFunction) {
        try {
            const pagedRequest = await mapToPagedRequestDto(request.query);
            const entitiesAndCount = await this.vendorsService.listVendors(pagedRequest);
            const pagedResponse = mapToPagedResponseDto(
                'Vendors fetched successfully',
                entitiesAndCount,
                pagedRequest,
                mapToVendorDtoList
            );

            response.status(200).json(pagedResponse);
        } catch (error) {
            next(error);
        }
    }

    async getVendorDetails(request: Request, response: Response, next: NextFunction) {
        try {
            const vendorId = Number(request.params.vendorId);
            const vendor = await this.vendorsService.getVendorDetails({id: vendorId});
            const responseData = mapToresponseDto('Vendor details fetched successfully', vendor, mapToVendorDto);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}