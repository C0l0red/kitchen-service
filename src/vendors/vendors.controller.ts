import {buildPagedRequestDto} from "../common/dto/paged-request.dto";
import VendorsService from "./vendors.service";
import {Request, Response, NextFunction} from "express";
import {buildPagedResponseDto} from "../common/dto/paged-response.dto";
import {buildResponse} from "../common/dto/response.dto";

export default class VendorsController {
    constructor(private readonly vendorsService: VendorsService) {
    }

    async listVendors(request: Request, response: Response, next: NextFunction) {
        try {
            const pagedRequest = await buildPagedRequestDto(request.query);
            const data = await this.vendorsService.listVendors(pagedRequest);
            const pagedResponse = buildPagedResponseDto('Vendors fetched successfully', data, pagedRequest);

            response.status(200).json(pagedResponse);
        } catch (error) {
            next(error);
        }
    }

    async getVendorDetails(request: Request, response: Response, next: NextFunction) {
        try {
            const vendorId = Number(request.params.vendorId);
            const data = await this.vendorsService.getVendorDetails({id: vendorId});
            const responseData = buildResponse('Vendor details fetched successfully', data);

            response.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}