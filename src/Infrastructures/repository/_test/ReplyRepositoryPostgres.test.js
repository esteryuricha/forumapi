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

    // describe('checkReplyById function', () => {
    //     it('should throw error when reply not found', async() => {
    //         //arrange
    //         await RepliesTableTestHelper.addReply({
    //             id: 'reply-123',
    //             commentId: 'comment-123',
    //             content: 'ini adalah balasan',
    //             owner: 'user-123',
    //             date: '2022-03-07T05:48:30.111Z'
    //         });
            
    //         const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

    //         //action and assert
    //         await expect(replyRepositoryPostgres.checkReplyById('reply')).rejects.toThrowError(NotFoundError);
    //     });

    //     it('should return reply correctly when it found', async() => {
    //         //arrange
    //         await RepliesTableTestHelper.addReply({
    //             id: 'reply-123',
    //             threadId: 'thread-123',
    //             commentId: 'comment-123',
    //             content: 'ini adalah balasan',
    //             owner: 'user-123',
    //             date: '2022-03-06T04:48:30.111Z'
    //         });
            
    //         const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

    //         //action
    //         const replyId = await replyRepositoryPostgres.checkReplyById('reply-123');

    //         //assert
    //         expect(replyId).toEqual('reply-123');
    //     });
    // });

    // describe('checkReplyOwner function', () => {
    //     it('should throw AuthorizationError when not owner', async() => {
    //         //arrange
    //         await RepliesTableTestHelper.addReply({
    //             id: 'reply-123',
    //             threadId: 'thread-123',
    //             commentId: 'comment-123',
    //             content: 'ini adalah balasan',
    //             owner: 'user-123',
    //             date: '2022-03-06T04:48:30.111Z'
    //         });

    //         const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

    //         //action and assert
    //         await expect(replyRepositoryPostgres.checkReplyOwner('reply-123', 'user-456')).rejects.toThrowError(AuthorizationError);
    //     });

    //     it('should not throw error when owner is valid', async() => {
    //         //arrange
    //         await RepliesTableTestHelper.addReply({
    //             id: 'reply-123',
    //             threadId: 'thread-123',
    //             commentId: 'comment-123',
    //             content: 'ini adalah balasan',
    //             owner: 'user-123',
    //             date: '2022-03-06T04:48:30.111Z'
    //         });

    //         const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

    //         //action and assert
    //         await expect(replyRepositoryPostgres.checkReplyOwner('reply-123', 'user-123')).resolves.toBeUndefined();        
    //     });
    // });

    // describe('deleteReply function', () => {
    //     it('should throw error when reply not found', async() => {
    //         //arrange
    //         await RepliesTableTestHelper.addReply({
    //             id: 'reply-123',
    //             threadId: 'thread-123',
    //             commentId: 'comment-123',
    //             content: 'ini adalah balasan',
    //             owner: 'user-123',
    //             date: '2022-03-06T04:48:30.111Z'
    //         });

    //         const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

    //         //action and assert
    //         await expect(replyRepositoryPostgres.deleteReply('reply-456')).rejects.toThrowError(NotFoundError);        
    //     });

    //     it('should delete reply correctly', async() => {
    //         //arrange
    //         await RepliesTableTestHelper.addReply({
    //             id: 'reply-123',
    //             threadId: 'thread-123',
    //             commentId: 'comment-123',
    //             content: 'ini adalah balasan',
    //             owner: 'user-123',
    //             date: '2022-03-06T04:48:30.111Z'
    //         });

    //         const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

    //         //action
    //         await replyRepositoryPostgres.deleteReply('reply-123');

    //         //assert
    //         const reply = await RepliesTableTestHelper.checkReplyById('reply-123');
    //         expect(reply[0].is_delete).toEqual(true);
    //     });
    // });

    // describe('getReply function', () => {
    //     it('should return empty array when reply not found', async() => {
    //         //arrange
    //         const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

    //         //action 
    //         const replies = await replyRepositoryPostgres.getReply('comment-789');

    //         //assert
    //         expect(replies).toStrictEqual([]);
    //     });

    //     it('should get reply correctly', async() => {
    //         //arrange
    //         await UsersTableTestHelper.addUser({
    //             id: 'user-456',
    //             username: 'johndoe',
    //             password: 'password',
    //             fullname: 'John Doe'
    //         });

    //         await CommentsTableTestHelper.addComment({
    //             id: 'comment-123',
    //             threadId: 'thread-123',
    //             content: 'ini adalah content',
    //             owner: 'user-456',
    //             date: '2022-03-06T03:48:30.111Z',              
    //             isDelete: false                
    //         });

    //         await RepliesTableTestHelper.addReply({
    //             id: 'reply-123',
    //             threadId: 'thread-123',
    //             commentId: 'comment-123',
    //             content: 'ini adalah balasan',
    //             owner: 'user-123',
    //             date: '2022-03-07T03:48:30.111Z',
    //             isDelete: false
    //         });

    //         await RepliesTableTestHelper.addReply({
    //             id: 'reply-456',
    //             threadId: 'thread-123',
    //             commentId: 'comment-123',
    //             content: 'ini adalah balasan selanjutnya',
    //             owner: 'user-456',
    //             date: '2022-03-07T03:50:30.111Z',
    //             isDelete: true
    //         });

    //         const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

    //         //action 
    //         const replies = await replyRepositoryPostgres.getReply('comment-123');
            
    //         //assert
    //         expect(reply).toHaveLength(2);
    //         expect(reply[0]).toStrictEqual(new GetReply({
    //             id: 'reply-123',
    //             content: 'ini adalah balasan',
    //             username: 'dicoding',
    //             date: '2022-03-07T03:48:30.111Z',
    //         }));

    //         expect(reply[1]).toStrictEqual(new GetReply({
    //             id: 'reply-456',
    //             content: '**balasan telah dihapus**',
    //             username: 'johndoe',
    //             date: '2022-03-07T03:50:30.111Z',
    //         }));
    //     });
    // });
});