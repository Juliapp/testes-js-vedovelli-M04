// const { appError } = require("@/utils");
import { StatusCodes } from 'http-status-codes';
import { appError } from '@/utils';
import { logger } from '@/utils/logger';
import createError from 'http-errors';

jest.mock('../../utils/logger.js');
jest.mock('http-errors');

describe('Utils > errors - unit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('it should execute logger.error', () => {
    const errorMessage = 'error message';

    appError(errorMessage);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(errorMessage);
  });

  it('should execute createError with message and default status code', () => {
    const errorMessage = 'error message';

    appError(errorMessage);

    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessage,
    );
  });
});

it('should execute createError with message and provided status code', () => {
  const errorMessage = 'error message';

  appError(errorMessage, StatusCodes.BAD_GATEWAY);

  expect(createError).toHaveBeenCalledTimes(1);
  expect(createError).toHaveBeenCalledWith(
    StatusCodes.BAD_GATEWAY,
    errorMessage,
  );
});
