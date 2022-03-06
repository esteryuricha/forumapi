const GetThread = require('../GetThread');

describe('GetThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        //arrange
        const payload = {};

        //action and assert
        expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        //arrange
        const payload = {
            id: true,
            title: true,
            body: true,
            date: {},
            username: true,
            comments: true
        };

        //action and assert
        expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should GetThread object correctly', () => {
        //arrange
        const payload = {
            id: 'thread-123',
            title: 'Tugas ForumAPI',
            body: 'Tugas ForumAPI harus selesai sebelum deadline',
            date: '2022-03-05T02:04:43.260Z',
            username: 'dicoding',
            comments: [
                {
                    id: 'comment-123',
                    username: 'dicoding',
                    date: '2022-03-06T03:48:30.111Z',
                    content: 'ini adalah content',
                    isDelete: false,
                },
                {
                    id: 'comment-456',
                    username: 'johndoe',
                    date: '2022-03-06T03:58:30.111Z',
                    content: '**komentar telah dihapus**',
                    isDelete: true
                }
            ],

        };

        //action
        const getThread = new GetThread(payload);

        //assert
        expect(getThread.id).toEqual(payload.id);
        expect(getThread.title).toEqual(payload.title);
        expect(getThread.body).toEqual(payload.body);
        expect(getThread.username).toEqual(payload.username);
        expect(getThread.date).toEqual(payload.date);
        expect(getThread.comments).toEqual(payload.comments);
    });
});