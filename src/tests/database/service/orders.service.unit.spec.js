import { buildError, buildOrders, buildUser } from 'test/builders';
import { Order } from '@/database/models/order.model';
import { listOrders, saveOrder } from '@/database/service/orders.service';
import { StatusCodes } from 'http-status-codes';
import { logger } from '@/utils/logger';

jest.mock('@/database/models/order.model');
jest.mock('@/utils/logger');

JSON.parse = jest.fn();

describe('Service > Orders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of orders', async () => {
    const user = buildUser();
    const where = { userid: user.id };

    const orders = buildOrders().map(order => {
      order.products = JSON.stringify(order.products);
      return order;
    });

    jest.spyOn(Order, 'findAll').mockResolvedValueOnce(orders);

    const returnedOrders = await listOrders(user.id);

    expect(returnedOrders).toEqual(orders);
    expect(Order.findAll).toHaveBeenCalledTimes(1);
    expect(Order.findAll).toHaveBeenCalledWith({ where });
    expect(Order.findAll).toHaveBeenCalledTimes(1);
  });

  it('should reject wieh an error when Oreder.findAll() fails', () => {
    const user = buildUser();
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to retrieve orders for user ${user.id}`,
    );

    jest.spyOn(Order, 'findAll').mockRejectedValue(error);

    expect(listOrders(user.id)).rejects.toEqual(error);
  });

  it('should save and return an order', () => {
    const user = buildUser();
    const data = {
      userid: user.id,
      products: buildOrders(),
    };

    const order = {
      ...data,
      id: 1,
    };

    jest.spyOn(Order, 'create').mockResolvedValueOnce(order);

    expect(saveOrder(data)).resolves.toEqual(order);
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith('New order saved', { data });
  });

  it('should reject an error when saveOrder is executed without any data', () => {
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Faild to sabe order',
    );

    expect(saveOrder()).rejects.toEqual(error);
  });
});
