const AddedComment = require('../AddedComment');

describe('AddedComment', () => {
    it('should throw error when did not contain needed property', () => {
        //arrange
        const payload = {};

        //action and assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when did not meet data type specification', () => {
        //arrange
        const payload = {
            id: 123,
            content: true,
            owner: {}
        };

        //action and assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedComment object correctly', () => {
        //arrange
        const payload = {
            id: 'comment-123',
            content: 'ini adalah content',
            owner: 'user-123'
        };

        //action
        const addedComment = new AddedComment(payload);

        //assert
        expect(addedComment.id).toEqual(payload.id);
        expect(addedComment.content).toEqual(payload.content);
        expect(addedComment.owner).toEqual(payload.owner);
    });
});