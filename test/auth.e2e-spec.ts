import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';

const request = require('supertest');
import {AppModule} from './../src/app.module';
import {applyAppSettings} from "../src/settings/apply.app.setting";


const HTTP_BASIC_USER = process.env.HTTP_BASIC_USER as string;
const HTTP_BASIC_PASS = process.env.HTTP_BASIC_PASS as string;

const getBasicAuthHeader = (username: string, password: string) => {
    const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${base64Credentials}`;
};

describe('Auth testing', () => {
    let app: INestApplication;
    let httpServer;

    let newUser1;
    let newUser2;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();


        app = moduleFixture.createNestApplication();
        applyAppSettings(app);
        await app.init();

        httpServer = app.getHttpServer();

        await request(httpServer)
            .delete('/testing/all-data')
            .expect(204);
    });

    afterAll(async () => {
        await app.close();
    });


    it('/registration User registration', async () => {

        const userDto = {
            login: 'testuser',
            password: 'testpassword',
            email: 'testuser@example.com'
        };

        await request(httpServer)
            .post('/auth/registration')
            //.set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userDto)
            .expect(204);

    });

    it('POST /auth/registration - should return 400 login already exists', async () => {

        const userDto = {
            login: 'testuser1',
            password: 'testpassword',
            email: 'testuser1@example.com'
        };

        await request(httpServer)
            .post('/auth/registration')
            .send(userDto)
            .expect(204);


        const duplicateUserDto = {
            login: 'testuser1',
            password: 'anotherpassword',
            email: 'testuser100@example.com'
        };

        const response = await request(httpServer)
            .post('/auth/registration')
            .send(duplicateUserDto)
            .expect(400);


        const expectedError = {
            errorsMessages: [
                {
                    message: 'User with this login already exists',
                    field: 'login',
                }
            ]
        };

        expect(response.body).toMatchObject(expectedError);
    });

    it('POST /auth/registration - should return 400 email already exists', async () => {
        // First, register a user with valid data
        const userDto = {
            login: 'testuser1',
            password: 'testpassword',
            email: 'testuser1@example.com'
        };

        await request(httpServer)
            .post('/auth/registration')
            .send(userDto)
            .expect(204);


        const duplicateUserDto = {
            login: 'testuser100',
            password: 'testpassword',
            email: 'testuser1@example.com'
        };

        const response = await request(httpServer)
            .post('/auth/registration')
            .send(duplicateUserDto)
            .expect(400);


        const expectedError = {
            errorsMessages: [
                {
                    message: 'User with this email already exists',
                    field: 'email',
                }
            ]
        };

        expect(response.body).toMatchObject(expectedError);
    });


    // it('/registration User registration - existing login or email', async () => {
    //
    //     const userDto = {
    //         login: 'testuser',
    //         password: 'testpassword',
    //         email: 'testuser@example.com'
    //     };

    // await request(httpServer)
    //     .post('/registration')
    //     .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
    //     .send(userDto)
    //     .expect(204);

    // Second registration with the same email/login
    //     const response = await request(httpServer)
    //         .post('/registration')
    //         .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
    //         .send(userDto)
    //         .expect(400);
    //
    //     const expectedError = {
    //         errorsMessages: [
    //             { message: 'User with this email or login already exists', field: 'email' }
    //         ]
    //     };
    //
    //     expect(response.body).toMatchObject(expectedError);
    // });

});
