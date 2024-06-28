import UsersService from "./users.service";
import {mockUsersRepository} from "../../tests/mocks";

jest.mock("../common/logger");

describe("Users Service", () => {
    let usersService: UsersService;

    beforeEach(() => {
        usersService = new UsersService(mockUsersRepository);
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getProfile", () => {
        it("should call findOneBy() once", async () => {
            await usersService.getProfile(1);
            expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: {id: 1},
                relations: {vendor: true, customer: true}
            });
        });
    });

    describe("findByUserId", () => {
        it("should call findOneBy() once", async () => {
            await usersService.findUserById(1);
            expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: {id: 1},
                relations: {vendor: true, customer: true}
            });
        });

        it("should throw if no user is found", async () => {
            jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(null);

            await expect(usersService.findUserById(1)).rejects.toThrow();
            expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
        });
    });

    describe("findUserByEmail", () => {
        it("should call findOne() once", async () => {
            await usersService.findUserByEmail("email@test.com");
            expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: {email: "email@test.com"},
                select: ['id', 'email', 'userType']
            });
        });

        it("should select password when included", async () => {
            await usersService.findUserByEmail("email@test.com", true);
            expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: {email: "email@test.com"},
                select: ['id', 'email', 'password', 'userType']
            });
        });
    });
})