const AddComments = require("../AddComments");

describe('an AddComments Entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'sebuah komentar',
            owner: 'user321',
        };
        expect(() => new AddComments(payload).toThrowError('ADD_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY'));
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            thread: "thread456",
            owner: true,
            content: 123,
        };

        // Action and Assert
        expect(() => new AddComments(payload)).toThrowError('ADD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should Adding Comment object correctly', () => {
        // Arrange
        const payload = {
            thread: "thread456",
            owner: "user321",
            content: 'sebuah komentar',
        };

        // Action
        const { thread, owner, content } = new AddComments(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(thread).toEqual(payload.thread);
        expect(owner).toEqual(payload.owner);
    });

});