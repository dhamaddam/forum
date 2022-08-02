class DeleteCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }


    _validatePayload(payload) {
        const { thread, comment, owner } = payload;

        if (!thread || !comment || !owner) {
            throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
        }

        if (typeof thread !== 'string' || typeof comment !== 'string' || typeof owner !== 'string') {
            throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

    async execute(dataPayload) {
        this._validatePayload(dataPayload);
        const { thread, comment, owner } = dataPayload;
        await this._threadRepository.checkExistsThread(thread);
        await this._commentRepository.checkExistsComment(comment);
        await this._commentRepository.verifyOwnerComment(comment, owner);
        await this._commentRepository.delComment(comment);
    }

}

module.exports = DeleteCommentUseCase;