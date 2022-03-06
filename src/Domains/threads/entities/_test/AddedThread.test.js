const AddedThread = require('../AddedThread');

describe('AddedThread Entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        //arrange
        const payload = {
            title: 'hello'
        };

        //action and assert
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        //arrange
        const payload = {
            id: true,
            title: true,
            owner: {}
        };

        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedThread object correctly', () => {
        //arrange 
        const payload = {
            id: 'thread-123',
            title: 'Tugas ForumAPI',
            owner: 'user-123'    
    };

        //action
        const { title, body, owner } = new AddedThread(payload);

        //assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
    });
});