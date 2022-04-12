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

        //filtering comments
        const {
            isDelete: isDeleteComment123,
            ...filteredCommentDetail123
        } = expectedGetComments[0];

        const {
            isDelete: isDeleteComment456,
            ...filteredCommentDetail456
        } = expectedGetComments[1];

        //filtering replies
        const {
            commentId: commentIdReply123, 
            isDelete: isDeleteReply123,
            ...filteredReplyDetail123
        } = expectedGetReplies[0];

        const {
            commentId: commentIdReply456, 
            isDelete: isDeleteReply456,
            ...filteredReplyDetail456
        } = expectedGetReplies[1];

        const expectedCommentsAndReplies = [
            { ...filteredCommentDetail123, replies: [filteredReplyDetail123] },
            { ...filteredCommentDetail456, replies: [filteredReplyDetail456] },
        ];

        getDetailThreadUseCase._mappingRepliesByComments = jest.fn(() => expectedCommentsAndReplies);
        getDetailThreadUseCase._getLikeCountByComment = jest.fn(() => Promise.resolve(expectedCommentsAndReplies));

        //action
        const thread = await getDetailThreadUseCase.execute(useCasePayload);

        //assert
        expect(mockThreadRepository.getDetailThread).toBeCalledWith('thread-123');
        expect(mockCommentRepository.getComment).toBeCalledWith('thread-123');
        expect(mockThreadRepository.getRepliesByThreadId).toBeCalledWith('thread-123');
        expect(thread).toEqual({ ...expectedGetDetailThread, comments: expectedCommentsAndReplies });
        expect(getDetailThreadUseCase._mappingRepliesByComments).toBeCalledWith([ filteredCommentDetail123, filteredCommentDetail456], expectedGetReplies);
        expect(getDetailThreadUseCase._getLikeCountByComment).toBeCalledWith(expectedCommentsAndReplies);
    });

    it('should operate _getLikeCountByComment function properly', async() => {
        //arrange
        const comments = [
            {
                id: 'comment-123',
                username: 'dicoding',
                date: '2022-03-06T03:48:30.111Z',
                content: 'ini adalah content',
                isDelete: false,
                replies: [{
                    id: 'reply-123',
                    username: 'dicoding',
                    date: '2022-03-26T03:58:30.111Z',
                    content: 'ini adalah balasan1',
                }],
                likeCount: 2
            },
            {
                id: 'comment-456',
                username: 'johndoe',
                date: '2022-03-06T03:58:30.111Z',
                content: 'ini adalah content2',
                isDelete: true,
                replies: [{
                    id: 'reply-456',
                    username: 'johndoe',
                    date: '2022-03-26T04:58:30.111Z',
                    content: 'ini adalah balasan2',
                }],
                likeCount: 0
            }
        ];

        const expectedComments = [
            {
                ...comments[0], likeCount: 2,
            },
            {
                ...comments[1], likeCount: 0
            }
        ];

        const mockLikeRepository = new LikeRepository();

        mockLikeRepository.getLikeCountByCommentId = jest.fn((commentId) => Promise.resolve(commentId === 'comment-123' ? 2 : 0));

        const getDetailThreadUseCase = new GetDetailThreadUseCase({ 
            threadRepository: {}, 
            commentRepository: {}, 
            likeRepository: mockLikeRepository 
        });

        const SpyGetLikeCountForComments = jest.spyOn(getDetailThreadUseCase, '_getLikeCountByComment');

        //action
        const result = await getDetailThreadUseCase._getLikeCountByComment(comments);


        //arrange
        expect(result).toEqual(expectedComments);
        expect(mockLikeRepository.getLikeCountByCommentId).toBeCalledTimes(2);

        SpyGetLikeCountForComments.mockClear();

    });

    it('should operate _mappingRepliesByComments function correctly', () => {
        //arrange
        const getDetailThreadUseCase = new GetDetailThreadUseCase({
            threadRepository: {},
            commentRepository: {},
            likeRepository: {}
        });

        const filteredComments = [
            {
                id: 'comment-123',
                username: 'dicoding',
                date: '2022-03-06T03:48:30.111Z',
                content: 'ini adalah content',
                replies: [],
                likeCount: 0
            },
            {
                id: 'comment-456',
                username: 'johndoe',
                date: '2022-03-06T03:58:30.111Z',
                content: 'ini adalah content2',
                replies: [],
                likeCount: 0
            }
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
                commentId: 'comment-456'
            }),
        ];

        //filtering replies
        const {
            commentId: commentIdReply123, 
            isDelete: isDeleteReply123,
            ...filteredReplyDetail123
        } = expectedGetReplies[0];

        const {
            commentId: commentIdReply456, 
            isDelete: isDeleteReply456,
            ...filteredReplyDetail456
        } = expectedGetReplies[1];

        const expectedCommentsAndReplies = [
            { ...filteredComments[0], replies: [filteredReplyDetail123] },
            { ...filteredComments[1], replies: [{ ...filteredReplyDetail456, content: '**balasan telah dihapus**' }] },
        ];

        const SpyGetRepliesForComments = jest.spyOn(getDetailThreadUseCase, '_mappingRepliesByComments');

        //action
        getDetailThreadUseCase._mappingRepliesByComments(filteredComments, expectedGetReplies);

        //assert
        expect(SpyGetRepliesForComments).toReturnWith(expectedCommentsAndReplies);

        SpyGetRepliesForComments.mockClear();   
    });
});