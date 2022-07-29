class AddComments {
    constructor(payload) {
        this._verifyPayload(payload);
        const { thread, owner, content } = payload;
        this.content = content;
        this.thread = thread;
        this.owner = owner;

    }

    _verifyPayload({ thread, owner, content }) {
        if (!thread || !owner || !content) {
            throw new Error('ADD_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        if (typeof thread !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
            throw new Error('ADD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddComments;