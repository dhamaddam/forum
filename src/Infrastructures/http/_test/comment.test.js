const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {

    afterEach(async() => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async() => {
        await pool.end();
    });



    describe('when POST /threads/{threadId}/comments ', () => {

        it('should response 401 if payload not access token', async() => {

            const server = await createServer(container);

            const response = await server.inject({

                method: 'POST',

                url: '/threads/xxx/comments',

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

                method: 'POST',

                url: `/threads/${threadResponse.data.addedThread.id}/comments`,

                payload: {},

                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('tidak dapat menambahkan comment baru karena properti yang dibutuhkan tidak ada ');
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
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: true,
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('tidak dapat menambahkan komentar baru dikarenakan tipe properti tidak sesuai');
        });

        it('should response 404 if thread id not valid', async() => {
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

                url: '/threads/xxx/comments',

                payload: {
                    content: 'sebuah komentar',
                },

                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('thread tidak ditemukan di database');
        });

        it('should response 201 and return addedComment', async() => {
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
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: 'sebuah komentar',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(201);

            expect(responseJson.status).toEqual('success');

            expect(responseJson.data.addedComment.content).toEqual('sebuah komentar');
        });
    });

    describe('when DELETE /threads/{threadId}/comments', () => {
        it('should response 403 if another user delete the comment', async() => {
            const loginPayload = {
                username: 'user321',
                password: 'naruto',
            };

            const loginPayload2 = {
                username: 'user456',
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

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {

                    username: 'user456',

                    password: 'naruto',

                    fullname: 'NarutoUser456',

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

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: 'sebuah komentar',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const commentResponse = JSON.parse(comment.payload);

            const authentication2 = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload2,
            });

            const responseAuth2 = JSON.parse(authentication2.payload);

            const response = await server.inject({
                method: 'DELETE',

                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}`,

                headers: { Authorization: `Bearer ${responseAuth2.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(403);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('tidak bisa menghapus komentar ');
        });

        it('should response 404 if token not found', async() => {
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

                    fullname: 'Narutouser321',

                },
            });

            const authentication = await server.inject({

                method: 'POST',

                url: '/authentications',

                payload: loginPayload,

            });

            const responseAuth = JSON.parse(authentication.payload);

            const response = await server.inject({

                method: 'DELETE',

                url: '/threads/xxx/comments/xxx',

                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan di database');
        });

        it('should response 404 if comment not found', async() => {
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

                    fullname: 'Narutouser321',
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
                method: 'DELETE',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/xxx`,
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('komentar tidak ditemukan');
        });

        it('should response 200 and return success', async() => {
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

                    fullname: 'Narutouser321',
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

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: 'sebuah komentar',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const commentResponse = JSON.parse(comment.payload);

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}`,
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);

            expect(responseJson.status).toEqual('success');

        });
    });
});