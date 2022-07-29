const AddedComment = require("../AddedComment");

describe("An AddedComment Entities", () => {
    it("should throw error when payload didnot contain suitable property", () => {
        const payload = {
            content: "sebuah komentar",
            owner: "user321",
        };
        expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should  throw An error when payload didnt meet data type specification", () => {
        const payload = {
            id: 123456,
            content: "sebuah komentar",
            owner: "321",
        };

        expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });

    it("should Adding new Comment object Correctly", () => {
        const payload = {
            id: "comment456",
            content: "sebuah komentar",
            owner: "user321",
        };

        const addedComment = new AddedComment(payload);

        expect(addedComment.id).toEqual(payload.id);
        expect(addedComment.content).toEqual(payload.content);
        expect(addedComment.owner).toEqual(payload.owner);

    });
});