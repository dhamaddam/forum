const AddComments = require("../../Domains/comments/entities/AddComments");

class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(dataPayload) {
        const { thread } = dataPayload;
        await this._threadRepository.checkExistsThread(thread);
        const addComment = new AddComments(dataPayload);
        return this._commentRepository.addComment(addComment);
    }
}
module.exports = AddCommentUseCase;