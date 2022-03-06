const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
    beforeEach(async() => {
        await UsersTableTestHelper.addUser({
            id: 'user-123',
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        });
    });

    afterEach(async() => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll( async() => {
        await pool.end();
    });

    describe('addThread function', () => {
        it('should add thread and return added thread correctly', async() => {
            //arrange
            const addThread = new AddThread({
                title: 'Tugas ForumAPI',
                body: 'Tugas ForumAPI harus selesai sebelum deadline',
                owner: 'user-123',
            });

            const fakeGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeGenerator);

            //action 
            await threadRepositoryPostgres.addThread(addThread);

            //assert
            const threads = await ThreadsTableTestHelper.checkThreadById('thread-123');
            expect(threads).toHaveLength(1);
        });

        it('should return added thread corectly', async() => {
            //arrange
            const addThread = new AddThread({
                title: 'Tugas ForumAPI',
                body: 'Tugas ForumAPI harus selesai sebelum deadline',
                owner: 'user-123',
            });

            const fakeGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeGenerator);

            //action
            const addedThread = await threadRepositoryPostgres.addThread(addThread);

            //assert
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: 'Tugas ForumAPI',
                owner: 'user-123'    
            }));
        });        
    });

    describe('checkThreadById function', () => {
        it('should throw NotFoundError when the thread not found', async() => {
            //arrange
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Tugas ForumAPI',
                body: 'Tugas ForumAPI harus selesai sebelum deadline',
                owner: 'user-123',
                date: '2022-03-05T02:04:43.260Z',
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            //action and assert
            await expect(threadRepositoryPostgres.checkThreadById('thread-456')).rejects.toThrowError(NotFoundError);
        });

        it('should return id when thread found', async() => {
            //arrange
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Tugas ForumAPI',
                body: 'Tugas ForumAPI harus selesai sebelum deadline',
                owner: 'user-123',
                date: '2022-03-05T02:04:43.260Z',
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            //action
            const threadId = await threadRepositoryPostgres.checkThreadById('thread-123');

            //assert
            expect(threadId).toEqual('thread-123');
        });
    });

    describe('getDetailThread', () => {
        it('should throw NotFoundError when the thread not found', async() => {
            //arrange
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Tugas ForumAPI',
                body: 'Tugas ForumAPI harus selesai sebelum deadline',
                owner: 'user-123',
                date: '2022-03-05T02:04:43.260Z',
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            //action and assert
            await expect(threadRepositoryPostgres.checkThreadById('thread-456')).rejects.toThrowError(NotFoundError);
        });

        it('should return value when thread found', async() => {
            //arrange
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Tugas ForumAPI',
                body: 'Tugas ForumAPI harus selesai sebelum deadline',
                owner: 'user-123',
                date: '2022-03-05T02:04:43.260Z',
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            //action
            const thread = await threadRepositoryPostgres.getDetailThread('thread-123');

            //assert
            expect(thread).toStrictEqual({
                id: 'thread-123',
                title: 'Tugas ForumAPI',
                body: 'Tugas ForumAPI harus selesai sebelum deadline',
                username: 'dicoding',
                date: '2022-03-05T02:04:43.260Z',
            });
        });
    });
});