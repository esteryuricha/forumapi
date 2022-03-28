const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');


describe('DeleteReplyUseCase', () => {
    it('should orchestrating the delete reply correctly', async() => {
        //arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
            owner: 'user-456'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.checkThreadById = jest.fn(() => Promise.resolve());

        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve());

        mockReplyRepository.checkReplyById = jest.fn(() => Promise.resolve());

        mockReplyRepository.checkReplyOwner = jest.fn(() => Promise.resolve());

        mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        });

        //action
        await deleteReplyUseCase.execute(useCasePayload);

        //assert
        expect(mockThreadRepository.checkThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.checkReplyById).toBeCalledWith(useCasePayload.replyId);
        expect(mockReplyRepository.checkReplyOwner).toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
        expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
    });
});