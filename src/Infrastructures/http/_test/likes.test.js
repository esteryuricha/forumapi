const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const pool = require('../../database/postgres/pool');

describe('/likes endpoint', () => {
    afterEach(async() => {
        await LikesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async() => {
        await pool.end();
    });

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('should response 200 when user give a like', async() => {
            //arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Tugas ForumAPI',
                body: 'Tugas ForumAPI harus selesai sebelum deadline',
                owner: 'user-123',
                date: '2022-04-06T02:04:43.260Z'
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
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-123/likes',
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

    describe("when DELETE /threads/{threadId}/comments/{commentId}/likes", () => {
        it('should response 200 when deleted reply correctly', async() => {
            //arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Tugas ForumAPI',
                body: 'Tugas ForumAPI harus selesai sebelum deadline',
                owner: 'user-123',
                date: '2022-04-06T02:04:43.260Z'
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                content: 'test content',
                owner: 'user-123',
                date: '2022-04-06T03:48:30.111Z',
                isDelete: false,
            });

            await LikesTableTestHelper.addLike({
                id: 'like-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
                date: '2022-04-06T03:48:30.111Z',
                isDelete: false
            })

            const server = await createServer(container);

            //action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/likes',
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