import { buildError, buildUser } from 'test/builders';
import { User } from '@/database/models/user.model';
import {
  findOrSave,
  listUsers,
  saveUser,
} from '@/database/service/users.service';
import { StatusCodes } from 'http-status-codes';
import { logger } from '@/utils/logger';

jest.mock('@/database/models/user.model');
jest.mock('@/utils/logger');
JSON.parse = jest.fn();

describe('Service > Users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should user a user when findOrSave is executed', async () => {
    const user = buildUser();

    jest.spyOn(User, 'findOrCreate').mockResolvedValueOnce(user);

    const where = { email: user.email };

    const saveUser = await findOrSave(user.email);

    expect(saveUser).toEqual(user);

    expect(User.findOrCreate).toHaveBeenCalledTimes(1);
    expect(User.findOrCreate).toHaveBeenCalledWith({ where });

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      `User located or created with email: ${user.email}`,
    );
  });

  it('should reject an error when findOrSave fails', async () => {
    const user = buildUser();

    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to find or create user with email: ${user.email}`,
    );

    jest.spyOn(User, 'findOrCreate').mockRejectedValueOnce(error);

    expect(findOrSave(user.email)).rejects.toEqual(error);
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('should rejects when saveUser is called with no param', () => {
    expect(saveUser()).rejects.toEqual('Failed to save user');
  });

  it('should save and return a user', async () => {
    const user = buildUser();

    jest.spyOn(User, 'create').mockResolvedValueOnce(user);

    const savedUser = await saveUser(user);

    expect(User.create).toHaveBeenCalledTimes(1);
    expect(User.create).toHaveBeenCalledWith({ email: user.email });

    expect(savedUser).toEqual(user);
  });

  it('should call findAll when listUsers is called', async () => {
    jest.spyOn(User, 'findAll').mockResolvedValueOnce([]);

    await listUsers();

    expect(User.findAll).toHaveBeenCalledTimes(1);
  });

  it('should reject an error when listUsers fails', async () => {
    const error = buildError('Failed to retrieve users');

    jest.spyOn(User, 'findAll').mockRejectedValueOnce(error);

    expect(listUsers()).rejects.toEqual(error);
  });
});
