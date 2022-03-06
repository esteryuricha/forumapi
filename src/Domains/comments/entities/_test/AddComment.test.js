const AddComment = require('../AddComment');

describe('AddComment', () => {
    it('should throw new error when did not contain needed property', () => {
        //arrange
        const payload = {};

        //action and assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw new error when did not meet data type specification', () => {
        //arrange
        const payload = {
            threadId: 123,
            content: true,
            owner: {}
        };

        //action and assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddComment object correctly', () => {
        //arrange
        const payload = {
            threadId: 'thread-123',
            content: 'ini adalah content',
            owner: 'user-123',
        };

        //action
        const addComment = new AddComment(payload);

        //assert
        expect(addComment.threadId).toEqual(payload.threadId);
        expect(addComment.content).toEqual(payload.content);
        expect(addComment.owner).toEqual(payload.owner);
    });
});