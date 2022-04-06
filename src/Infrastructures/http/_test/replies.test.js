const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const pool = require('../../database/postgres/pool');

describe('/replies endpoint', () => {
    afterEach(async() => {
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async() => {
        await pool.end();
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 201 and persisted replies', async() => {
            //arrange
            const requestPayload = {
                content: 'ini adalah balasan'
            }

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
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            //assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply).toBeDefined();
            expect(responseJson.data.addedReply.content).toEqual(requestPayload.content);
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should response 200 when deleted reply correctly', async() => {
            //arrange
            const requestPayload = {
                content: 'ini adalah balasan'
            }

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

            await RepliesTableTestHelper.addReply({
                id: 'reply-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'ini adalah balasan',
                owner: 'user-123',
                date: '2022-04-06T03:48:30.111Z',
                isDelete: false
            });

            const server = await createServer(container);

            //action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            //assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});
