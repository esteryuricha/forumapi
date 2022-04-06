const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {    
    afterAll(async() => {
        await pool.end();
    });

    afterEach(async() => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async() => {
            //arrange
            const requestPayload = {
                title: 'Tugas Dicoding',
                body: 'Ini adalah thread'
            };  

            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            //action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
              });
            
        
            //assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data).toBeDefined();
            expect(responseJson.data.addedThread).toBeDefined();
            expect(responseJson.data.addedThread.id).toBeDefined();
            expect(responseJson.data.addedThread.title).toBeDefined();
            expect(responseJson.data.addedThread.owner).toBeDefined();      
        });

        it('should response 401 when request did not have accessToken', async() => {
            //arrange
            const requestPayload = {
                title: 'Tugas Dicoding',
                body: 'Ini adalah thread'
            };  

            const server = await createServer(container);

            //action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload
            });

            //assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 400 when request payload did not contain needed property', async() => {
            //arrange
            const requestPayload = {};

            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            //action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            //assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and get comments correctly', async() => {
            //arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            });

            await UsersTableTestHelper.addUser({
                id: 'user-456',
                username: 'johndoe',
                password: 'secret',
                fullname: 'John Doe'
            });

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Tugas ForumAPI',
                body: 'Tugas ForumAPI harus selesai sebelum deadline',
                owner: 'user-123',
                date: '2022-04-06T02:04:43.260Z',
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                content: 'test content',
                owner: 'user-123',
                date: '2022-04-06T03:48:30.111Z',
                isDelete: false,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-456',
                threadId: 'thread-123',
                content: 'test new content',
                owner: 'user-456',
                date: '2022-04-06T10:49:06.563Z',
                isDelete: true,
            });

            const server = await createServer(container);

            //action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123'
            });

            //assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data).toBeDefined();
            expect(responseJson.data.thread).toBeDefined();
            expect(responseJson.data.thread.comments).toHaveLength(2);

        });
    });
});