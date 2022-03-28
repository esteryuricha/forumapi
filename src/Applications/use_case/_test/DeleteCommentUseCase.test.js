const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the delete comment correctly', async() => {
        //arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.checkThreadById = jest.fn(() => Promise.resolve());
        
        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve());

        mockCommentRepository.checkCommentOwner = jest.fn(() => Promise.resolve());

        mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        });

        //action
        await deleteCommentUseCase.execute(useCasePayload);

        //assert
        expect(mockThreadRepository.checkThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.checkCommentOwner).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);

    });
});