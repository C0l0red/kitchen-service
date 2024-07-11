import {pagedRequestDtoMapper} from "../common/dto/paged-request.dto";
import VendorsService from "./vendors.service";
import {Request, Response, NextFunction} from "express";
import {pagedResponseDtoMapper} from "../common/dto/paged-response.dto";
import {responseDtoMapper} from "../common/dto/response.dto";
import {CreateVendorDto, createVendorDtoMapper} from "./dto/create-vendor.dto";

export default class VendorsController {
    constructor(private readonly vendorsService: VendorsService) {
    }

    async createVendor(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: CreateVendorDto = await createVendorDtoMapper(request.body);
            await this.vendorsService.createVendor(dto);
            const responseData = responseDtoMapper("Vendor created successful");

            response.status(201).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async listVendors(request: Request, response: Response, next: NextFunction) {
        try {
            const pagedRequest = await pagedRequestDtoMapper(request.query);
            const data = await this.vendorsService.listVendors(pagedRequest);
            const pagedResponse = pagedResponseDtoMapper('Vendors fetched successfully', data, pagedRequest);

            response.status(200).json(pagedResponse);
        } catch (error) {
            next(error);
        }
    }

    async getVendorDetails(request: Request, response: Response, next: NextFunction) {
        try {
            const vendorId = Number(request.params.vendorId);
            const data = await this.vendorsService.getVendorDetails({id: vendorId});
            const responseData = responseDtoMapper('Vendor details fetched successfully', data);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}