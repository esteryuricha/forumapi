const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const pool = require('../../database/postgres/pool');

describe('/comments endpoint', () => {
    afterEach(async() => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async() => {
        await pool.end();
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and persisted comment', async() => {
            //arrange
            const requestPayload = {
                content: 'ini adalah comment'
            };

            const accessToken = await ServerTestHelper.getAccessToken();

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Tugas ForumAPI',
                body: 'Tugas ForumAPI harus selesai sebelum deadline',
                owner: 'user-123',
                date: '2022-04-06T02:04:43.260Z',
            });

            const server = await createServer(container);

            //action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            //assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
            expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 404 when thread not found', async () => {
            //arrange
            const requestPayload = {
              content: 'ini adalah comment',
            };
      
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);
      
            //action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
      
            //assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Thread not found!');
        });

        it('should response 401 when request did not have accesToken', async () => {
            // Arrange
            const requestPayload = {
              content: 'ini adalah comment',
            };
      
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
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

            const server = await createServer(container);
      
            //action
            const response = await server.inject({
              method: 'DELETE',
              url: '/threads/thread-123/comments/comment-123',
              payload: requestPayload,
            });
      
            //assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.message).toEqual('Missing authentication');
        });
      
        it('should response 200 when delete comment correctly', async () => {
            //arrange
            const requestPayload = {
              content: 'ini adalah comment',
            };
      
            const accessToken = await ServerTestHelper.getAccessToken();

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

            const server = await createServer(container);
      
            //action
            const response = await server.inject({
              method: 'DELETE',
              url: '/threads/thread-123/comments/comment-123',
              payload: requestPayload,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
      
            //assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});