const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const GetReply = require('../../../Domains/replies/entities/GetReply');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetDetailThreadUseCase', () => {
    it('should orchestrating get detail thread action correctly', async() => {
        //arrange
        const useCasePayload = {
            threadId: 'thread-123'
        };

        const expectedGetDetailThread = new GetThread({
            id: 'thread-123',
            title: 'Tugas ForumAPI',
            body: 'Tugas ForumAPI harus selesai sebelum deadline',
            date: '2022-03-05T02:04:43.260Z',
            username: 'dicoding'
        });

        const expectedGetComments = [
            new GetComment({
                id: 'comment-123',
                username: 'dicoding',
                date: '2022-03-06T03:48:30.111Z',
                content: 'ini adalah content',
                isDelete: false,
                replies: [],
                likeCount: 0
            }),
            new GetComment({
                id: 'comment-456',
                username: 'johndoe',
                date: '2022-03-06T03:58:30.111Z',
                content: 'ini adalah content2',
                isDelete: true,
                replies: [],
                likeCount: 0
            })
        ];

        const expectedGetReplies = [
            new GetReply({
                id: 'reply-123',
                username: 'dicoding',
                date: '2022-03-26T03:58:30.111Z',
                content: 'ini adalah balasan1',
                isDelete: false,
                commentId: 'comment-123'
            }),
            new GetReply({
                id: 'reply-456',
                username: 'johndoe',
                date: '2022-03-26T04:58:30.111Z',
                content: 'ini adalah balasan2',
                isDelete: true,
                commentId: 'comment-123'
            }),
        ];

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.getDetailThread = jest.fn(() => Promise.resolve({ ...expectedGetDetailThread, comments: []}));
        mockCommentRepository.getComment = jest.fn(() => Promise.resolve(expectedGetComments));
        mockThreadRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve(expectedGetReplies));

        const getDetailThreadUseCase = new GetDetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeRepository: {}
        });

        //action
        const thread = await getDetailThreadUseCase.execute(useCasePayload);

        //assert
        expect(mockCommentRepository.getComment).toBeCalledWith('thread-123');
        expect(mockThreadRepository.getDetailThread).toBeCalledWith('thread-123');
        expect(mockThreadRepository.getRepliesByThreadId).toBeCalledWith('thread-123');
        expect(thread).toEqual({ ...expectedGetDetailThread, comments: expectedGetComments });
    });
});