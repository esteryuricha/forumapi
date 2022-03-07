const GetReply = require('../GetReply');

describe('GetReply entities', () => {
    it('should throw error when did not contain needed property', () => {
        //arrange
        const payload = {};

        //action and assert
        expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when did not meet data type specification', () => {
        //arrange
        const payload = {
            id: 123,
            content: true,
            date: {},
            username: {},
            isDelete: false
        };

        //action and assert
        expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create GetReply object correctly', () => {
        //arrange
        const payload = {
            id: 'reply-123',
            content: 'ini adalah balasan',
            date: '2021-03-07T07:59:48.766Z',
            username: 'johndoe',
            isDelete: false
        };

        //action
        const getReply = new GetReply(payload);

        //assert
        expect(getReply.id).toEqual(payload.id);
        expect(getReply.content).toEqual(payload.content);
        expect(getReply.date).toEqual(payload.date);
        expect(getReply.username).toEqual(payload.username);
    });

    it('should create GetReply object correctly when isDelete is true', () => {
        //arrange
        const payload = {
            id: 'reply-123',
            content: 'ini adalah balasan',
            date: '2021-03-07T07:59:48.766Z',
            username: 'johndoe',
            isDelete: true
        };

        //action
        const getReply = new GetReply(payload);

        //assert
        expect(getReply.id).toEqual(payload.id);
        expect(getReply.content).toEqual('**balasan telah dihapus**');
        expect(getReply.date).toEqual(payload.date);
        expect(getReply.username).toEqual(payload.username);
    });
});