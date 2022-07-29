const DetailsThread = require('../DetailsThread');

describe('a DetailsThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {};

        expect(() => new DetailsThread(payload)).toThrowError('DETAILS_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            thread: 123,
        };

        expect(() => new DetailsThread(payload)).toThrowError('DETAILS_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create DetailThread object correctly', () => {
        const payload = {
            thread: 'thread123',
        };

        const { thread } = new DetailsThread(payload);

        expect(thread).toEqual(payload.thread);
    });
});