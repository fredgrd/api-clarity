import supertest from 'supertest';
import { createHttpServer } from '../../http-server';
import { randomUUID } from 'crypto';
import { connectDB } from '../../database';
import * as dotenv from 'dotenv';
import { before } from 'node:test';

const app = createHttpServer();

beforeAll(() => {
  dotenv.config();
});

// Testing the auth functionality
describe('auth', () => {
  // Testing the signin
  describe('signin', () => {
    // Conditions for testing
    describe('given no email or password or token', () => {
      it('should return a 400 with Error: BadData', async () => {
        const response = await supertest(app).post('/auth/signin');

        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('BadData');
      });
    });

    describe('given a wrong email', () => {
      // Connect to database
      beforeAll(async () => await connectDB());

      it('should return a 400 with Error: BadData', async () => {
        const email = randomUUID().toString();
        const password = 'password';

        const response = await supertest(app)
          .post('/auth/signin')
          .send({ email, password });

        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('BadData');
      });
    });

    describe('given a wrong password', () => {
      // Connect to database
      beforeAll(async () => await connectDB());

      it('should return a 400 with Error: BadData', async () => {
        const email = process.env.TESTS_EMAIL;
        const password = randomUUID().toString();

        const response = await supertest(app)
          .post('/auth/signin')
          .send({ email, password });

        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('BadData');
      });
    });

    describe('given a wrong token', () => {
      // Connect to database
      beforeAll(async () => await connectDB());

      it('should return a 400 with Error: BadData', async () => {
        const token = randomUUID().toString();

        const response = await supertest(app)
          .post('/auth/signin')
          .send({ token });

        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('BadData');
      });
    });

    describe('given the correct email and password', () => {
      // Connect to database
      beforeAll(async () => await connectDB());

      it('should return a 200', async () => {
        const email = process.env.TESTS_EMAIL;
        const password = process.env.TESTS_PASSWORD;

        const response = await supertest(app)
          .post('/auth/signin')
          .send({ email, password });

        expect(response.statusCode).toBe(200);
      });

      it('should return the correct user', async () => {
        const email = process.env.TESTS_EMAIL;
        const password = process.env.TESTS_PASSWORD;

        const response = await supertest(app)
          .post('/auth/signin')
          .send({ email, password });

        expect(response.body.id).toBe(process.env.TESTS_USER_ID);
      });
    });

    describe('given the correct token', () => {
      // Connect to database
      beforeAll(async () => await connectDB());

      it('should return a 200', async () => {
        const token = process.env.TESTS_TOKEN;

        const response = await supertest(app)
          .post('/auth/signin')
          .send({ token });

        expect(response.statusCode).toBe(200);
      });

      it('should return the correct user', async () => {
        const token = process.env.TESTS_TOKEN;

        const response = await supertest(app)
          .post('/auth/signin')
          .send({ token });

        expect(response.body.id).toBe(process.env.TESTS_USER_ID);
      });
    });
  });
});
