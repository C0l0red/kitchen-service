import {mapToPagedRequestDto} from "../common/dto/paged-request.dto";
import VendorsService from "./vendors.service";
import {Request, Response, NextFunction} from "express";
import {mapToPagedResponseDto} from "../common/dto/paged-response.dto";
import {mapToresponseDto} from "../common/dto/response.dto";
import {CreateVendorDto, mapToCreateVendorDto} from "./dto/create-vendor.dto";

export default class VendorsController {
    constructor(private readonly vendorsService: VendorsService) {
    }

    async createVendor(request: Request, response: Response, next: NextFunction) {
        try {
            const dto: CreateVendorDto = await mapToCreateVendorDto(request.body);
            await this.vendorsService.createVendor(dto);
            const responseData = mapToresponseDto("Vendor created successful");

            response.status(201).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async listVendors(request: Request, response: Response, next: NextFunction) {
        try {
            const pagedRequest = await mapToPagedRequestDto(request.query);
            const data = await this.vendorsService.listVendors(pagedRequest);
            const pagedResponse = mapToPagedResponseDto('Vendors fetched successfully', data, pagedRequest);

            response.status(200).json(pagedResponse);
        } catch (error) {
            next(error);
        }
    }

    async getVendorDetails(request: Request, response: Response, next: NextFunction) {
        try {
            const vendorId = Number(request.params.vendorId);
            const data = await this.vendorsService.getVendorDetails({id: vendorId});
            const responseData = mapToresponseDto('Vendor details fetched successfully', data);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}