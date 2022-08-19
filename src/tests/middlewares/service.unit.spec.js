import { get } from '@/middleware/service.middleware';

describe('Middleware > Service', () => {
  it('should add service to the request', () => {
    const req = {};
    const next = jest.fn();

    get(req, null, next);

    expect(req.service).toBeDefined();
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(/* nothing */);
  });
});
