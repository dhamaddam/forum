const AddedThread = require("../AddedThread");

describe('An AddedThread entities', () => {
    it("should throw an error when payload did'nt contain suitable property", () => {
        const payload = {
            title: 'sebuah judul',
            body: 'batang tubuh',
        };

        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

    });

    it("should throw an error when payload did'nt meet data type spesification", () => {
        const payload = {
            id: 9321,
            title: [],
            owner: 123,
        };
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it("should create new thread object as requested", () => {
        const payload = {
            id: "threads123",
            title: "sebuah judul",
            owner: "user123",
        };

        const addedThread = new AddedThread(payload);

        expect(addedThread.id).toEqual(payload.id);
        expect(addedThread.title).toEqual(payload.title);
        expect(addedThread.owner).toEqual(payload.owner);
    });
});