const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const GetComment = require('../../../Domains/comments/entities/GetComment');

describe('CommentRepositoryPostgres', () => {
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
    });

    afterEach(async() => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async() => {
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist add comment and return added comment correctly', async() => {
            //arrange
            const addComment = new AddComment({
                threadId: 'thread-123',
                content: 'ini adalah content',
                owner: 'user-123'
            });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            //action
            await commentRepositoryPostgres.addComment(addComment);

            //assert
            const comments = await CommentsTableTestHelper.checkCommentById('comment-123');
            expect(comments).toHaveLength(1);
        });

        it('should return added comment correctly', async() => {
            //arrange
            const addComment = new AddComment({
                threadId: 'thread-123',
                content: 'ini adalah content',
                owner: 'user-123'
            });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            //action 
            const addedComment = await commentRepositoryPostgres.addComment(addComment);

            //assert
            expect(addedComment).toStrictEqual( new AddedComment({
                id: 'comment-123',
                content : 'ini adalah content',
                owner: 'user-123'
            }));
        });
    });

    describe('checkCommentById function', () => {
        it('should throw error when comment not found', async() => {
            //arrange
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                content: 'ini adalah content',
                owner: 'user-123',
                date: '2022-03-06T03:48:30.111Z'
            });
            
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //action and assert
            await expect(commentRepositoryPostgres.checkCommentById('comment')).rejects.toThrowError(NotFoundError);
        });

        it('should return comment correctly when it found', async() => {
            //arrange
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                content: 'ini adalah content',
                owner: 'user-123',
                date: '2022-03-06T03:48:30.111Z'
            });
            
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //action
            const commentId = await commentRepositoryPostgres.checkCommentById('comment-123');

            //assert
            expect(commentId).toEqual('comment-123');
        });
    });

    describe('checkCommentOwner function', () => {
        it('should throw AuthorizationError when not owner', async() => {
            //arrange
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                content: 'ini adalah content',
                owner: 'user-123',
                date: '2022-03-06T03:48:30.111Z'                
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //action and assert
            await expect(commentRepositoryPostgres.checkCommentOwner('comment-123', 'user-456')).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw error when owner is valid', async() => {
            //arrange
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                content: 'ini adalah content',
                owner: 'user-123',
                date: '2022-03-06T03:48:30.111Z'                
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //action and assert
            await expect(commentRepositoryPostgres.checkCommentOwner('comment-123', 'user-123')).resolves.toBeUndefined();        
        });
    });

    describe('deleteComment function', () => {
        it('should throw error when comment not found', async() => {
            //arrange
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                content: 'ini adalah content',
                owner: 'user-123',
                date: '2022-03-06T03:48:30.111Z'                
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //action and assert
            await expect(commentRepositoryPostgres.deleteComment('comment-456')).rejects.toThrowError(NotFoundError);        
        });

        it('should delete comment correctly', async() => {
            //arrange
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                content: 'ini adalah content',
                owner: 'user-123',
                date: '2022-03-06T03:48:30.111Z'                
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //action
            await commentRepositoryPostgres.deleteComment('comment-123');

            //assert
            const comment = await CommentsTableTestHelper.checkCommentById('comment-123');
            expect(comment[0].is_delete).toEqual(true);
        });
    });

    describe('getComment function', () => {
        it('should return empty array when comment not found', async() => {
            //arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //action 
            const comments = await commentRepositoryPostgres.getComment('thread-123');

            //assert
            expect(comments).toStrictEqual([]);
        });

        it('should get comment correctly', async() => {
            //arrange
            await UsersTableTestHelper.addUser({
                id: 'user-456',
                username: 'johndoe',
                password: 'password',
                fullname: 'John Doe'
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                content: 'ini adalah content',
                owner: 'user-123',
                date: '2022-03-06T03:48:30.111Z',              
                isDelete: false                
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-456',
                threadId: 'thread-123',
                content: '**komentar telah dihapus**',
                owner: 'user-456',
                date: '2022-03-06T03:58:30.111Z',              
                isDelete: true              
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //action 
            const comment = await commentRepositoryPostgres.getComment('thread-123');

            //assert
            expect(comment).toHaveLength(2);
            expect(comment).toStrictEqual([
                new GetComment({
                    id: 'comment-123',
                    username: 'dicoding',
                    date: '2022-03-06T03:48:30.111Z',
                    content: 'ini adalah content',
                    isDelete: false,
                }),
                new GetComment({
                    id: 'comment-456',
                    username: 'johndoe',
                    date: '2022-03-06T03:58:30.111Z',
                    content: '**komentar telah dihapus**',
                    isDelete: true
                })
            ]);
        });
    });
});
