import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SharedModule } from '../src/shared/shared.module';
import * as request from 'supertest';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const expectedEmail = 'user@server.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: expectedEmail,
        password: 'password',
      })
      .expect(201);
    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(expectedEmail);
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const userEmail = 'john@server.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: userEmail, password: 'password' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(userEmail);
  });
});
