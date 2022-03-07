const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReply = require('../../../Domains/replies/entities/AddReply');

describe('AddReplyUseCase', () => {
    it('should orchestrating the add reply action correctly', async() => {
        //arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            content: 'ini adalah balasan',
            owner: 'user-456'
        };

        const expectedAddedReply = new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner
        });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.checkThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve());

        mockCommentRepository.checkCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve());

        mockReplyRepository.addReply = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedAddedReply));

        const addReplyUseCase = new AddReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        });

        //action
        const addedReply = await addReplyUseCase.execute(useCasePayload);

        //assert
        expect(addedReply).toStrictEqual(expectedAddedReply);
        expect(mockThreadRepository.checkThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
            threadId: 'thread-123',
            commentId: 'comment-123',
            content: 'ini adalah balasan',
            owner: 'user-456'
        }));        
    });
});