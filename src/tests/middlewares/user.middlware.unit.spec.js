import { appError } from '@/utils';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { get } from '@/middleware/user.middleware';

import * as service from '@/database/service';
import { buildError, buildNext, buildReq } from 'test/builders';
jest.mock('@/database/service');

describe('Middleware > User', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should forward an error when an email is not provided in the header', () => {
    const req = buildReq({ headers: {} });
    const next = buildNext();

    const error = buildError(
      `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );

    get(req, null, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should forward an invalid email is provided in the header', () => {
    const req = buildReq({ headers: { email: 'invalid_email' } });
    const next = buildNext();

    const error = appError(
      `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );

    get(req, null, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should return an user object given a valid value email is provided', async () => {
    const req = buildReq();
    const next = buildNext();
    const email = req.headers.email;

    const resolved = { id: 1, email };

    jest.spyOn(service, 'findOrSave').mockResolvedValueOnce([resolved]);

    await get(req, null, next);

    expect(req.user).toBeDefined();
    expect(req.user).toEqual(resolved);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(/*nothing*/);
  });

  it('should foward an error when service.findOrSave fails', async () => {
    const req = buildReq();
    const next = buildNext();
    const email = req.headers.email;

    delete req.user;

    jest.spyOn(service, 'findOrSave').mockRejectedValueOnce('Um erro qualquer');

    await get(req, null, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('Um erro qualquer');
  });
});
