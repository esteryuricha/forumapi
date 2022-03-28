const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async() => {
        //arrange
        const useCasePayload = {
            threadId: 'thread-123',
            content: 'ini adalah content',
            owner: 'user-123',
        };

        const expectedAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner
        });

        //create dependency of use case
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.checkThreadById = jest.fn(() => Promise.resolve());

        mockCommentRepository.addComment = jest.fn(() => Promise.resolve(expectedAddedComment));

        //create use case instance
        const addCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        //action 
        const addedComment = await addCommentUseCase.execute(useCasePayload);

        //assert
        expect(addedComment).toStrictEqual(expectedAddedComment);
        expect(mockThreadRepository.checkThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
            threadId: 'thread-123',
            content: 'ini adalah content',
            owner: 'user-123'
        }));


    });
});