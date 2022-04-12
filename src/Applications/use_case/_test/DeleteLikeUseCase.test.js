const DeleteLikeUseCase = require('../DeleteLikeUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteLikeUseCase', () => {
    it('should orchestrating the delete like correctly', async() => {
        //arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();

        mockThreadRepository.checkThreadById = jest.fn(() => Promise.resolve());
        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve());
        mockLikeRepository.checkLikeOwnerByCommentId = jest.fn(() => Promise.resolve());
        mockLikeRepository.deleteLikeByCommentIdAndOwner = jest.fn(() => Promise.resolve());

        const deleteLikeUseCase = new DeleteLikeUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepository
        });

        //action
        await deleteLikeUseCase.execute(useCasePayload);

        //assert
        expect(mockThreadRepository.checkThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(useCasePayload.commentId);
        expect(mockLikeRepository.checkLikeOwnerByCommentId).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockLikeRepository.deleteLikeByCommentIdAndOwner).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);


        
    });
});