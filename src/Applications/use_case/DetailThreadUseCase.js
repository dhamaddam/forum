const DetailsComment = require("../../Domains/comments/entities/DetailsComment");
const DetailsThread = require("../../Domains/threads/entities/DetailsThread");

class DetailsThreadUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(dataPayload) {
        const { thread } = new DetailsThread(dataPayload);


        await this._threadRepository.checkExistsThread(thread);
        const detailsThread = await this._threadRepository.getDetailsThread(thread);

        const getCommentsThread = await this._commentRepository.getCommentsThread(thread);

        detailsThread.comments = new DetailsComment({
            comments: getCommentsThread
        }).comments;
        return {
            thread: detailsThread,
        };
    }
}

module.exports = DetailsThreadUseCase;