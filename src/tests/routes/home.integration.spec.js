import app from '@/app';
import supertest from 'supertest';
import { buildUser } from 'test/builders';

const request = supertest(app);

describe('Router > Integration > Home', () => {
  it('should return status value 200 and welcome message', async () => {
    const res = await request.get('/api').set('email', buildUser().email);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ welcome: 'Welcome Stranger!' });
  });
});
