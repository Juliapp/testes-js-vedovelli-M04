import app from '@/app';
import supertest from 'supertest';
import { buildOrder, buildOrders, buildUser } from 'test/builders';

import * as service from '@/database/service/orders.service';
jest.mock('@/database/service/orders.service');

const request = supertest(app);

describe('Router > Integration > Orders', () => {
  it('should return status value 200 and a list of orders', async done => {
    const orders = buildOrders();
    jest.spyOn(service, 'listOrders').mockResolvedValueOnce(orders);

    const res = await request.get('/api/order').set('email', buildUser().email);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ orders });

    // testes assíncronos
    // esse método vai lidar com a parada da requisição com o próximo teste
    done();
  });
});