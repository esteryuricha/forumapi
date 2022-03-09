const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const GetReply = require('../../../Domains/replies/entities/GetReply');

describe('ReplyRepositoryPostgres', () => {
    beforeEach(async() => {
        await UsersTableTestHelper.addUser({
            id: 'user-123',
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        });

        await ThreadsTableTestHelper.addThread({
            id: 'thread-123',
            title: 'ini adalah title',
            body: 'ini adalah body',
            owner: 'user-123',
            date: '2022-03-05T02:04:43.260Z'
        });

        await CommentsTableTestHelper.addComment({
            id: 'comment-123',
            content: 'ini adalah comment',
            owner: 'user-456',
            date: '2022-03-05T03:04:43.260Z'
        });
    });

    afterEach(async() => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async() => {
        await pool.end();
    });

    describe('addReply function', () => {
        it('should persist add reply and return added reply correctly', async() => {
            //arrange
            const addReply = new AddReply({
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'ini adalah balasan',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            //action
            await replyRepositoryPostgres.addReply(addReply);

            //assert
            const replies = await RepliesTableTestHelper.checkReplyById('reply-123');
            expect(replies).toHaveLength(1);
        });

        it('should return added reply correctly', async() => {
            //arrange
            const addReply = new AddReply({
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'ini adalah balasan',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            //action 
            const addedReply = await replyRepositoryPostgres.addReply(addReply);

            //assert
            expect(addedReply).toStrictEqual( new AddedReply({
                id: 'reply-123',
                content : 'ini adalah balasan',
                owner: 'user-123'
            }));
        });
    });
});