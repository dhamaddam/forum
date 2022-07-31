const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');


describe('/threads endpoint', () => {

    afterEach(async() => {

        await ThreadsTableTestHelper.cleanTable();

        await UsersTableTestHelper.cleanTable();

    });
    afterAll(async() => {
        await pool.end();
    });



    describe('when POST /threads', () => {
        it('should response 401 if payload not access token', async() => {

            const server = await createServer(container);

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {},
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(401);

            expect(responseJson.error).toEqual('Unauthorized');

            expect(responseJson.message).toEqual('Missing authentication');

        });

        it('should response 400 if payload not contain needed property', async() => {

            const loginPayload = {

                username: 'user321',

                password: 'naruto',
            };

            const server = await createServer(container);

            await server.inject({

                method: 'POST',

                url: '/users',

                payload: {

                    username: 'user321',

                    password: 'naruto',

                    fullname: 'NarutoUser321',

                },
            });

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const responseAuth = JSON.parse(authentication.payload);

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {},
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('tidak dapat menambahan thread baru karena prperty yang dibutuhkan tidak ada');
        });

        it('should response 400 if payload not meet data type specification', async() => {

            const loginPayload = {

                username: 'user321',

                password: 'naruto',

            };

            const server = await createServer(container);

            await server.inject({

                method: 'POST',

                url: '/users',

                payload: {

                    username: 'user321',

                    password: 'naruto',

                    fullname: 'NarutoUser321',

                },
            });

            const authentication = await server.inject({

                method: 'POST',

                url: '/authentications',

                payload: loginPayload,

            });

            const responseAuth = JSON.parse(authentication.payload);

            const response = await server.inject({
                method: 'POST',

                url: '/threads',

                payload: {

                    title: true,

                    body: 4562,

                },

                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('tidak dapat menambahkan thread baru karena tipe properti yang dibutuhkan tidak sesuai');
        });

        it('should response 201 and create new thread', async() => {
            const loginPayload = {
                username: 'user321',

                password: 'naruto',
            };

            const server = await createServer(container);

            await server.inject({

                method: 'POST',

                url: '/users',

                payload: {
                    username: 'user321',

                    password: 'naruto',

                    fullname: 'NarutoUser321',
                },
            });

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const responseAuth = JSON.parse(authentication.payload);

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'sebuah judul thread',
                    body: 'lorem ipsum dolorr sit amet',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread.title).toEqual('sebuah judul thread');
        });
    });
    describe('when GET /threads/{threadId}', () => {
        it('should response 404 when threads not valid', async() => {
            const loginPayload = {
                username: 'user321',
                password: 'naruto',
            };

            const server = await createServer(container);

            await server.inject({

                method: 'POST',

                url: '/users',

                payload: {

                    username: 'user321',

                    password: 'naruto',

                    fullname: 'NarutoUser321',
                },
            });

            const authentication = await server.inject({
                method: 'POST',

                url: '/authentications',

                payload: loginPayload,

            });

            const responseAuth = JSON.parse(authentication.payload);

            const response = await server.inject({
                method: 'GET',
                url: '/threads/xxxx',
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan di database');
        });

        it('should response 200 and return detail thread', async() => {
            const loginPayload = {
                username: 'user321',

                password: 'naruto',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'user321',

                    password: 'naruto',

                    fullname: 'NarutoUser321',
                },
            });

            const authentication = await server.inject({
                method: 'POST',

                url: '/authentications',

                payload: loginPayload,
            });

            const responseAuth = JSON.parse(authentication.payload);

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'sebuah thread',
                    body: 'batang tubuh',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const threadResponse = JSON.parse(thread.payload);
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadResponse.data.addedThread.id}`,
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);

            expect(responseJson.status).toEqual('success');

            expect(responseJson.data.thread.id).
            toEqual(threadResponse.data.addedThread.id);

            expect(responseJson.data.thread.title).toEqual('sebuah thread');

            expect(responseJson.data.thread.body).toEqual('batang tubuh');

            expect(responseJson.data.thread.username).toEqual('user321');

            expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
        });
    });
});