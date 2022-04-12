const AddLike = require('../AddLike');

describe('AddLike', () => {
    it('should throw error when not contain needed property', () => {
        //arrange
        const payload = {};

        //action and arrange
        expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when not meet data type specification', () => {
        //arrange
        const payload = {
            threadId: 123,
            commentId: 123,
            owner: true,
            date: true
        };

        //action and assert
        expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddLike object correctly', () => {
        const payload = {
            commentId: 'comment-123',
            owner: 'user-123',
            threadId: 'thread-123',
            date: '2022-03-05T03:04:43.260Z'
        };

        const addLike = new AddLike(payload);
        expect(addLike.threadId).toEqual(payload.threadId);
        expect(addLike.commentId).toEqual(payload.commentId);
        expect(addLike.owner).toEqual(payload.owner);
    });
});