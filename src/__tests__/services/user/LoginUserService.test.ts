import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IUserRepository } from '../../../repository/interfaces/IUserRepository';
import { TokenGenerator } from '../../../auth/TokenGenerator';
import { UserDomain } from '../../../domain/UserDomain';
import { LoginUserService } from '../../../services/user/LoginUserService';
import { comparePassword } from '../../../utils/validations/comparePassword';

// Mock das funções e classes necessárias
vi.mock('../../../auth/TokenGenerator');
vi.mock('../../../utils/validations/comparePassword');

describe('LoginUserService', () => {
    let loginUserService: LoginUserService;
    let userRepository: IUserRepository;
    let tokenGenerator: TokenGenerator;

    beforeEach(() => {
        userRepository = {
            loginUser: vi.fn(),
            updateAccessToken: vi.fn(),
            updateRefreshToken: vi.fn(),
        } as unknown as IUserRepository;

        tokenGenerator = {
            generateAccessToken: vi.fn(),
            generateRefreshToken: vi.fn(),
        } as unknown as TokenGenerator;

        loginUserService = new LoginUserService(userRepository);
        (loginUserService as any).tokenGenerator = tokenGenerator; // Injetando o mock do TokenGenerator
    });

    it('should return null if user is not found', async () => {
        const user = new UserDomain({
            userEmail: 'test@example.com',
            userPassword: 'Password123',
        });

        (userRepository.loginUser as any).mockResolvedValue(null);

        const result = await loginUserService.execute(user);

        expect(userRepository.loginUser).toHaveBeenCalledWith('test@example.com');
        expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
        const user = new UserDomain({
            userEmail: 'test@example.com',
            userPassword: 'Password123',
        });

        const loggedUser = new UserDomain({
            userEmail: 'test@example.com',
            userPassword: 'DifferentPassword123',
        });

        (userRepository.loginUser as any).mockResolvedValue(loggedUser);
        (comparePassword as any).mockReturnValue(false);

        const result = await loginUserService.execute(user);

        expect(userRepository.loginUser).toHaveBeenCalledWith('test@example.com');
        expect(comparePassword).toHaveBeenCalledWith('Password123', 'DifferentPassword123');
        expect(result).toBeNull();
    });

    it('should generate tokens and return the user if password matches', async () => {
        const user = new UserDomain({
            userEmail: 'test@example.com',
            userPassword: 'Password123',
        });

        const loggedUser = new UserDomain({
            userEmail: 'test@example.com',
            userPassword: 'Password123',
        });

        const accessToken = 'access-token';
        const refreshToken = 'refresh-token';
        const accessTokenExpiration = new Date();
        const refreshTokenExpiration = new Date();

        (userRepository.loginUser as any).mockResolvedValue(loggedUser);
        (comparePassword as any).mockReturnValue(true);
        (tokenGenerator.generateAccessToken as any).mockReturnValue({ token: accessToken, expiresAt: accessTokenExpiration });
        (tokenGenerator.generateRefreshToken as any).mockReturnValue({ token: refreshToken, expiresAt: refreshTokenExpiration });

        const result = await loginUserService.execute(user);

        expect(userRepository.loginUser).toHaveBeenCalledWith('test@example.com');
        expect(comparePassword).toHaveBeenCalledWith('Password123', 'Password123');
        expect(tokenGenerator.generateAccessToken).toHaveBeenCalledWith(loggedUser);
        expect(tokenGenerator.generateRefreshToken).toHaveBeenCalledWith(loggedUser);
        expect(userRepository.updateAccessToken).toHaveBeenCalledWith(loggedUser);
        expect(userRepository.updateRefreshToken).toHaveBeenCalledWith(loggedUser);

        expect(result).toEqual({
            ...loggedUser,
            userPassword: '',
            accessToken,
            accessTokenExpiration,
            refreshToken,
            refreshTokenExpiration,
        });
    });

    it('should throw an error if an exception occurs', async () => {
        const user = new UserDomain({
            userEmail: 'test@example.com',
            userPassword: 'Password123',
        });

        const error = new Error('Some error');
        (userRepository.loginUser as any).mockRejectedValue(error);

        await expect(loginUserService.execute(user)).rejects.toThrow(error);
        expect(userRepository.loginUser).toHaveBeenCalledWith('test@example.com');
    });
});
