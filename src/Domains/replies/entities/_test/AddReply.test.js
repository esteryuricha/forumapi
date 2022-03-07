const AddReply = require('../AddReply');

describe('AddReply entities', () => {
    it('should throw error when did not contain needed property', () => {
        //arrange
        const payload = {};

        //action and assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when did not meet data type specification', () => {
        //arrange
        const payload = {
            threadId: true,
            commentId: true,
            content: true,
            owner: {}
        };

        //action and assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddReply object correctly', () => {
        //arrange
        const payload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            content: 'ini adalah content reply',
            owner: 'user-456'
        };

        //action
        const { threadId, commentId, content, owner } = new AddReply(payload);

        //assert
        expect(threadId).toEqual(payload.threadId);
        expect(commentId).toEqual(payload.commentId);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});