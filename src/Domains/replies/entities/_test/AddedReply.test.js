const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
    it('should throw error when did not contain needed property', () => {
        //arrange
        const payload = {};

        //action and assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when did not meet data type specification', () => {
        //arrange
        const payload = {
            id: 123,
            content: true,
            owner: {}
        };

        //action and assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedReply object correctly', () => {
        //arrange
        const payload = {
            id: 'reply-123',
            content: 'ini adalah content reply',
            owner: 'user-123'
        };

        //action
        const addedReply = new AddedReply(payload);

        //assert
        expect(addedReply.id).toEqual(payload.id);
        expect(addedReply.content).toEqual(payload.content);
        expect(addedReply.owner).toEqual(payload.owner);
    });
});