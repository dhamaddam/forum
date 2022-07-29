class DetailsComment {
    constructor(payload) {
        this._verifyPayload(payload);
        const comments = this.mapToPayload(payload);
        this.comments = comments;
    }

    _verifyPayload({ comments }) {
        if (!comments) {
            throw new Error('DETAILS_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (!Array.isArray(comments)) {
            throw new Error('DETAILS_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
    mapToPayload({ comments }) {
        return comments.map((comment) => ({
            id: comment.id,

            username: comment.username,

            date: comment.date,

            content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
        }));
    }
}

module.exports = DetailsComment;