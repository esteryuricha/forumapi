const Jwt = require('@hapi/jwt');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects
        .toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken);

      // Action & Assert
      expect(expectedUsername).toEqual('dicoding');
    });
  });

  describe('verifyAccessToken', () => {
    it('should throw InvariantError when verification failed', async() => {
      // arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // action and assert
      await expect(jwtTokenManager.verifyAccessToken(accessToken))
        .rejects
        .toThrow(InvariantError);
    });

    it('should not throw InvariantError when access token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action and Assert
      await expect(jwtTokenManager.verifyAccessToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('getTokenFromHeader', () => {
    it('should return token correctly from a header', async () => {
      // arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const header = 'Bearer token123';

      // action
      const token = await jwtTokenManager.getTokenFromHeader(header);

      // assert
      expect(token).toEqual('token123');
    });

    it('should throw error when no header is provided', async () => {
      // arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const header = '';

      // action & assert
      await expect(jwtTokenManager.getTokenFromHeader(header))
        .rejects
        .toThrow(AuthenticationError);
    });
  });
});
