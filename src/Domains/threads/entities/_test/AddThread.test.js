const AddThread = require('../AddThread');

describe('AddThread Entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        //arrange
        const payload = {
            title: 'hello'
        };

        //action and assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        //arrange
        const payload = {
            title: true,
            body: true,
            owner: {}
        };

        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddThread object correctly', () => {
        //arrange 
        const payload = {
            title: 'Tugas ForumAPI',
            body: 'Tugas ForumAPI harus selesai sebelum deadline',
            owner: 'user-123'
        };

        //action
        const { title, body, owner } = new AddThread(payload);

        //assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
    });
});