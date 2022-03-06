const GetComment = require('../GetComment');

describe('GetComment entities', () => {
    it('should throw error when did not contain needed property', () => {
        //arrange
        const payload = {};

        //action and assert
        expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when did not meet data type specification', () => {
        //arrange
        const payload = {
            id: 123,
            username: {},
            date: 2022,
            content: true,
            isDelete: false
        };

        //action and assert
        expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create GetComment object correctly', () => {
        //arrange
        const payload = {
            id: 'comment-123',
            username: 'dicoding',
            date: '2022-03-06T10:49:06.563Z',
            content: 'ini adalah content',
            isDelete: false
        };

        //action
        const getComment = new GetComment(payload);

        //assert
        expect(getComment.id).toEqual(payload.id);
        expect(getComment.username).toEqual(payload.username);
        expect(getComment.date).toEqual(payload.date);
        expect(getComment.content).toEqual(payload.content);
    });

    it('should create GetComment object correctly when isDelete is true', () => {
        //arrange
        const payload = {
            id: 'comment-123',
            username: 'dicoding',
            date: '2022-03-06T10:49:06.563Z',
            content: 'ini adalah content',
            isDelete: true
        };

        //action
        const getComment = new GetComment(payload);

        //assert
        expect(getComment.id).toEqual(payload.id);
        expect(getComment.username).toEqual(payload.username);
        expect(getComment.date).toEqual(payload.date);
        expect(getComment.content).toEqual('**komentar telah dihapus**');
    });
});