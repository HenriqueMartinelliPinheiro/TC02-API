import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IUserRepository } from '../../../repository/interfaces/IUserRepository';
import { IRoleRepository } from '../../../repository/interfaces/IRoleRepository';
import { UserDomain } from '../../../domain/UserDomain';
import { CreateUserService } from '../../../services/user/CreateUserService';
import { generatePasswordHash } from '../../../utils/generatePasswordHash';
import { RoleDomain } from '../../../domain/RoleDomain';

vi.mock('../../../utils/generatePasswordHash');

describe('CreateUserService', () => {
    let createUserService: CreateUserService;
    let userRepository: IUserRepository;
    let roleRepository: IRoleRepository;

    beforeEach(() => {
        userRepository = {
            createUser: vi.fn(),
            getUserByEmail: vi.fn(),
        } as unknown as IUserRepository;

        roleRepository = {
            getRoleById: vi.fn(),
        } as unknown as IRoleRepository;

        createUserService = new CreateUserService(userRepository, roleRepository);
    });

    it('should hash the user password and create the user', async () => {
        const user = new UserDomain({
            userName: 'Test User',
            userEmail: 'test@example.com',
            userPassword: 'Password123',
            role: new RoleDomain({
                roleId: 1,
                roleTitle: 'Admin',
            }),
        });

        const hashedPassword = 'hashedPassword123';
        (generatePasswordHash as any).mockResolvedValue(hashedPassword);

        const role = new RoleDomain({
            roleId: 1,
            roleTitle: 'Admin',
        });
        (roleRepository.getRoleById as any).mockResolvedValue(role);

        (userRepository.getUserByEmail as any).mockResolvedValue(null);

        const createdUser = new UserDomain({
            userName: 'Test User',
            userEmail: 'test@example.com',
            userPassword: hashedPassword,
            role: role,
        });
        (userRepository.createUser as any).mockResolvedValue(createdUser);

        const result = await createUserService.execute(user);

        expect(generatePasswordHash).toHaveBeenCalledWith('Password123');
        expect(roleRepository.getRoleById).toHaveBeenCalledWith(1);
        expect(userRepository.createUser).toHaveBeenCalledWith(expect.any(UserDomain));
        expect(result).toEqual(createdUser);
    });

    it('should throw an error if role does not exist', async () => {
        const user = new UserDomain({
            userName: 'Test User',
            userEmail: 'test@example.com',
            userPassword: 'Password123',
            role: new RoleDomain({
                roleId: 1,
                roleTitle: 'Admin',
            }),
        });

        (generatePasswordHash as any).mockResolvedValue('hashedPassword123');
        (roleRepository.getRoleById as any).mockResolvedValue(null);

        await expect(createUserService.execute(user)).rejects.toThrow('Error on getRole');
        expect(roleRepository.getRoleById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if role title does not match', async () => {
        const user = new UserDomain({
            userName: 'Test User',
            userEmail: 'test@example.com',
            userPassword: 'Password123',
            role: new RoleDomain({
                roleId: 1,
                roleTitle: 'Admin',
            }),
        });

        const role = new RoleDomain({
            roleId: 1,
            roleTitle: 'User',
        });

        (generatePasswordHash as any).mockResolvedValue('hashedPassword123');
        (roleRepository.getRoleById as any).mockResolvedValue(role);

        await expect(createUserService.execute(user)).rejects.toThrow('Error on getRole');
        expect(roleRepository.getRoleById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if user creation fails', async () => {
        const user = new UserDomain({
            userName: 'Test User',
            userEmail: 'test@example.com',
            userPassword: 'Password123',
            role: new RoleDomain({
                roleId: 1,
                roleTitle: 'Admin',
            }),
        });

        const role = new RoleDomain({
            roleId: 1,
            roleTitle: 'Admin',
        });

        (generatePasswordHash as any).mockResolvedValue('hashedPassword123');
        (roleRepository.getRoleById as any).mockResolvedValue(role);
        (userRepository.getUserByEmail as any).mockResolvedValue(null);
        (userRepository.createUser as any).mockResolvedValue(null);

        await expect(createUserService.execute(user)).rejects.toThrow('Error when creatingUser');
        expect(userRepository.createUser).toHaveBeenCalledWith(expect.any(UserDomain));
    });

    it('should throw an error if generatePasswordHash fails', async () => {
        const user = new UserDomain({
            userName: 'Test User',
            userEmail: 'test@example.com',
            userPassword: 'Password123',
            role: new RoleDomain({
                roleId: 1,
                roleTitle: 'Admin',
            }),
        });

        const error = new Error('Hashing Error');
        (generatePasswordHash as any).mockRejectedValue(error);

        await expect(createUserService.execute(user)).rejects.toThrow(error);
        expect(generatePasswordHash).toHaveBeenCalledWith('Password123');
    });
});
