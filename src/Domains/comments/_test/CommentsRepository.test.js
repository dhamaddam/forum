const CommentsRepository = require("../CommentsRepository")

describe("CommentsRepository Interface", () => {
    it("should throw an error when invoke abstract behavior", async() => {
        const commentRepository = new CommentsRepository();

        await expect(commentRepository.addComment({})).rejects.toThrowError("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
        await expect(commentRepository.checkCommentExist({})).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.verifyOwnerComment({})).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.delComment({})).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.getCommentsThread('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    })
})