import AuthService from "./auth.service";
import EncryptionService from "../common/encryption.service";
import {UserType} from "../users/model/user-type.enum";
import {mockCustomersService, mockUsersService, mockVendorsService, mockUser} from "../../tests/mocks";
import {CreateCustomerDto, CreateVendorDto} from "./dto/register.dto";

jest.mock("../common/encryption.service");

describe("Auth Service", () => {
    let service: AuthService;

    beforeEach(() => {
        service = new AuthService(mockUsersService, mockVendorsService, mockCustomersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {
        it("should call findUserByEmail(), compareHash() and generateToken() once each", async () => {
            const mockCompareHash = jest.spyOn(EncryptionService, 'compareHash');
            mockCompareHash.mockResolvedValue(true);

            const mockGenerateToken = jest.spyOn(EncryptionService, 'generateToken');
            mockGenerateToken.mockReturnValue("auth-token");

            await service.login({email: "email@test.com", password: "password"});

            expect(mockUsersService.findUserByEmail).toHaveBeenCalledTimes(1);
            expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith('email@test.com', true);

            expect(mockCompareHash).toHaveBeenCalledTimes(1);
            expect(mockCompareHash).toHaveBeenCalledWith("password", "password");

            expect(mockGenerateToken).toHaveBeenCalledTimes(1);
            expect(mockGenerateToken).toHaveBeenCalledWith({
                sub: mockUser.email,
                id: mockUser.id,
                userType: UserType.CUSTOMER
            });
        });

        it("should throw if no user is returned", async () => {
            jest.spyOn(mockUsersService, 'findUserByEmail').mockResolvedValueOnce(null);

            await expect(service.login({
                email: "invalid@test.com",
                password: "password"
            })).rejects.toThrow("Invalid Credentials");
        });

        it("should throw if password doesn't match", async () => {
            const mockCompareHash = jest.spyOn(EncryptionService, 'compareHash');
            mockCompareHash.mockResolvedValue(false);

            await expect(service.login({
                email: "email@test.com",
                password: "password"
            })).rejects.toThrow("Invalid Credentials");
        });
    });

    describe("register", () => {
        describe('vendors', () => {
            const createVendorDto: CreateVendorDto = {
                email: 'email@test.com',
                password: 'password',
                businessName: 'Test Business',
                businessDescription: 'Test Business Description',
                phoneNumber: '08123456789'
            }
            it('should call findUserByEmail(), generateHash() and createVendor() once each', async () => {
                const mockGenerateHash = jest.spyOn(EncryptionService, 'generateHash');
                mockGenerateHash.mockResolvedValue("hashedPassword");
                jest.spyOn(mockUsersService, 'findUserByEmail').mockResolvedValueOnce(null);

                await service.register(createVendorDto, UserType.VENDOR);

                expect(mockUsersService.findUserByEmail).toHaveBeenCalledTimes(1);
                expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith('email@test.com');

                expect(mockGenerateHash).toHaveBeenCalledTimes(1);
                expect(mockGenerateHash).toHaveBeenCalledWith("password");

                expect(mockVendorsService.createVendor).toHaveBeenCalledTimes(1);
                expect(mockVendorsService.createVendor).toHaveBeenCalledWith(createVendorDto);
            });

            it("should throw if the email is taken", async () => {
                await expect(service.register(createVendorDto, UserType.VENDOR))
                    .rejects.toThrow("A user with this email already exists");
            });
        });

        describe('customers', () => {
            const createCustomerDto: CreateCustomerDto = {
                email: 'email@test.com',
                password: 'password',
                firstName: 'Test',
                lastName: 'User',
                phoneNumber: '08123456789'
            }
            it('should call findUserByEmail(), generateHash() and createVendor() once each', async () => {
                const mockGenerateHash = jest.spyOn(EncryptionService, 'generateHash');
                mockGenerateHash.mockResolvedValue("hashedPassword");
                jest.spyOn(mockUsersService, 'findUserByEmail').mockResolvedValueOnce(null);

                await service.register(createCustomerDto, UserType.CUSTOMER);

                expect(mockUsersService.findUserByEmail).toHaveBeenCalledTimes(1);
                expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith('email@test.com');

                expect(mockGenerateHash).toHaveBeenCalledTimes(1);
                expect(mockGenerateHash).toHaveBeenCalledWith("password");

                expect(mockCustomersService.createCustomer).toHaveBeenCalledTimes(1);
                expect(mockCustomersService.createCustomer).toHaveBeenCalledWith(createCustomerDto);
            });

            it("should throw if the email is taken", async () => {
                await expect(service.register(createCustomerDto, UserType.CUSTOMER))
                    .rejects.toThrow("A user with this email already exists");
            });
        });
    });
})