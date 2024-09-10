import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
// import request from 'supertest';
const request = require('supertest');
import {AppModule} from './../src/app.module';
import {applyAppSettings} from "../src/settings/apply.app.setting";
import {ExtractJwt} from "passport-jwt";
import fromHeader = ExtractJwt.fromHeader;

const HTTP_BASIC_USER = process.env.HTTP_BASIC_USER as string;
const HTTP_BASIC_PASS = process.env.HTTP_BASIC_PASS as string;

const getBasicAuthHeader = (username: string, password: string) => {
    const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${base64Credentials}`;
};

describe('Users testing', () => {
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

    it('Get all users before create users', async () => {
        const response = await request(httpServer)
            .get('/users')
            .expect(200);

        const expectedResponse = {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        };

        expect(response.body).toEqual(expectedResponse);
    });


    it('/users Create user', async () => {

        const userDto = {
            login: 'testuser',
            password: 'testpassword',
            email: 'testuser@example.com'
        };

        const response = await request(httpServer)
            .post('/users')
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userDto)
            .expect(201);

        newUser1 = response.body;

        const expectedUser = {
            login: userDto.login,
            email: userDto.email,
            id: expect.any(String),
            createdAt: expect.any(String)
        };

        expect(newUser1).toMatchObject(expectedUser);

    });

    it('/users Create user', async () => {

        const userDto = {
            login: 'testuser2',
            password: 'testpassword2',
            email: 'testuser2@example.com'
        };

        const response = await request(httpServer)
            .post('/users')
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userDto)
            .expect(201);

        newUser2 = response.body;

        const expectedUser = {
            login: userDto.login,
            email: userDto.email,
            id: expect.any(String),
            createdAt: expect.any(String)
        };

        expect(newUser2).toMatchObject(expectedUser);

    });

    it('Get all users after create user', async () => {
        const response = await request(httpServer)
            .get('/users')
            .expect(200);

        const expectedResponse = {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                {
                    id: newUser1.id,
                    login: newUser1.login,
                    email: newUser1.email,
                    createdAt: newUser1.createdAt
                },
                {
                    id: newUser2.id,
                    login: newUser2.login,
                    email: newUser2.email,
                    createdAt: newUser2.createdAt
                }
            ]
        };

        expect(response.body).toEqual(expectedResponse);
    });

});
