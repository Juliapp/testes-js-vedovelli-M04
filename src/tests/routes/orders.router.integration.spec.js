import { buildError, buildOrder, buildOrders } from 'test/builders';
import * as service from '@/database/service';
import { buildCall } from 'test/builder.integration';
import { StatusCodes } from 'http-status-codes';

jest.mock('@/database/service');

describe('Router > Integration > Orders', () => {
  it('should return status value 200 and a list of orders', async done => {
    const orders = buildOrders();
    jest.spyOn(service, 'listOrders').mockResolvedValueOnce(orders);

    const res = await buildCall('/api/order');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ orders });

    // testes assíncronos
    // esse método vai lidar com a parada da requisição com o próximo teste
    done();
  });

  it('should return status 500 and error message when listOrder rejects', async done => {
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to retrieve list of orders',
    );

    jest.spyOn(service, 'listOrders').mockRejectedValueOnce(error);

    const res = await buildCall('/api/order');

    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toEqual({ message: 'Failed to retrieve list of orders' });

    done();
  });

  it('should return status 200 and the newest created order', async done => {
    jest.spyOn(service, 'saveOrder').mockResolvedValueOnce({
      id: 123,
    });

    const res = await buildCall('/api/order', 'post', {
      products: buildOrder(),
    });

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toEqual({ order: { id: 123 } });

    done();
  });

  it('return status status 500 and an error message when saveOrder rejects', async done => {
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to save order',
    );

    jest.spyOn(service, 'saveOrder').mockRejectedValueOnce(error);

    const res = await buildCall('/api/order', 'post', {
      products: buildOrder(),
    });

    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toEqual({ message: 'Failed to save order' });

    done();
  });

  it('should return status 500 and an error message when saveOrder rejects', async done => {
    const res = await buildCall('/api/order', 'post');

    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body).toEqual({
      errors: [
        {
          location: 'body',
          msg: 'Please provide a list of products',
          param: 'products',
        },
      ],
    });
    done();
  });
});
