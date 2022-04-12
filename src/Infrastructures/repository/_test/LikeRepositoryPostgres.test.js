const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddLike = require('../../../Domains/likes/entities/AddLike');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');


describe('LikeRepositoryPostgres', () => {
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
            owner: 'user-123',
            date: '2022-03-05T03:04:43.260Z'
        });
    });

    afterEach(async() => {
        await LikesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async() => {
        await pool.end();
    });

    describe('addLike function', () => {
        it('should persist add like correctly', async() => {
            //arrange
            const addLike = new AddLike({
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
                date: '2022-03-05T03:04:43.260Z'
            });

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            //action
            await likeRepositoryPostgres.addLike(addLike);

            //assert
            const likes = await LikesTableTestHelper.checkLikeById('like-123');
            expect(likes).toHaveLength(1);
        });

    });

    describe('getLikeCountByCommentId function', () => {
        it('should return likeCount properly', async() => {
            //arrange
            await LikesTableTestHelper.addLike({
                id: 'like-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
                date: '2022-03-05T03:04:43.260Z'
            });

            const likeRepositoryPostgres = await new LikeRepositoryPostgres(pool, {});
            
            //action
            const likes = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');

            //assert
            expect(likes).toEqual("1");
        });
    });

    describe('checkLikeOwnerByCommentId function', () => {
        it('should throw AuthorizationError when not owner', async() => {
            //arrange
            await LikesTableTestHelper.addLike({
                id: 'like-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
                date: '2022-03-05T03:04:43.260Z'
            });

            const likeRepositoryPostgres = await new LikeRepositoryPostgres(pool, {});

            //action and assert
            await expect(likeRepositoryPostgres.checkLikeOwnerByCommentId('comment-123', 'user-456')).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw error when owner is valid', async() => {
            //arrange
            await LikesTableTestHelper.addLike({
                id: 'like-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
                date: '2022-03-05T03:04:43.260Z'
            });

            const likeRepositoryPostgres = await new LikeRepositoryPostgres(pool, {});

            //action and assert
            await expect(likeRepositoryPostgres.checkLikeOwnerByCommentId('comment-123', 'user-123')).resolves.toBeUndefined();
        });
    });

    describe('deleteLikeByCommentIdAndOwner function', () => {
        it('should throw error when like not found', async() => {
            //arrange
            await LikesTableTestHelper.addLike({
                id: 'like-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
                date: '2022-03-05T03:04:43.260Z'
            });

            const likeRepositoryPostgres = await new LikeRepositoryPostgres(pool, {});

            //action and assert
            await expect(likeRepositoryPostgres.deleteLikeByCommentIdAndOwner('comment-456', 'user-456')).rejects.toThrowError(NotFoundError);
        });

        it('should delete like correctly', async() => {
            //arrange
            await LikesTableTestHelper.addLike({
                id: 'like-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
                date: '2022-03-05T03:04:43.260Z'
            });

            const likeRepositoryPostgres = await new LikeRepositoryPostgres(pool, {});

            //action
            await likeRepositoryPostgres.deleteLikeByCommentIdAndOwner('comment-123', 'user-123');

            //assert
            const like = await LikesTableTestHelper.checkLikeById('like-123');
            expect(like[0].is_delete).toEqual(true);
        });
    });

});
