const AddLikeUseCase = require('../AddLikeUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const AddLike = require('../../../Domains/likes/entities/AddLike');

describe('AddLikeUseCase', () => {
    it('should orchestrating the add like action correctly', async() => {
        //arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
            date: '2022-03-05T03:04:43.260Z'
        };

        const expectedAddedLike = {
            id: 'like-123',
            commentId: useCasePayload.commentId,
            owner: useCasePayload.owner,
            date: useCasePayload.date
        };

        //create dependency of use case
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();

        mockThreadRepository.checkThreadById = jest.fn(() => Promise.resolve());
        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve());
        mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

        //create use case instance
        const addLikeUseCase = new AddLikeUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepository
        });

        //action
        await addLikeUseCase.execute(useCasePayload);
        
        //assert
        expect(mockThreadRepository.checkThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(useCasePayload.commentId);
        expect(mockLikeRepository.addLike).toBeCalledWith(new AddLike({
            threadId: useCasePayload.threadId,
            commentId: useCasePayload.commentId,
            owner: useCasePayload.owner,
            date: useCasePayload.date
        }));
    });
});
