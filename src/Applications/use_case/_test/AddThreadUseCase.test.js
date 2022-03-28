const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async() => {
        //arrange
        const useCasePayload = {
            title: 'Tugas ForumAPI',
            body: 'Tugas ForumAPI harus selesai sebelum deadline',
            owner: 'user-123'
        };

        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: useCasePayload.owner
        });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest.fn(() => Promise.resolve(expectedAddedThread));

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository
        });

        //action 
        const addedThread = await addThreadUseCase.execute(useCasePayload);

        //assert
        expect(addedThread).toStrictEqual(expectedAddedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner
        }));


    });
});