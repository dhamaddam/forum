const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const DetailThreadUseCase = require("../../../../Applications/use_case/DetailThreadUseCase");
class ThreadsHandler {
    constructor(container) {
        this._container = container;
        this.postThreadsHandler = this.postThreadsHandler.bind(this);
        this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
    }
    async postThreadsHandler(request, h) {
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const { id: owner } = request.auth.credentials;
        const { title, body } = request.payload;
        const dataThread = {
            title,
            body,
            owner,
        }
        const addedThread = await addThreadUseCase.execute(dataThread);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getDetailThreadHandler(request, h) {
        const detailThread = this._container.getInstance(DetailThreadUseCase.name);
        const dataPayload = {
            thread: request.params.threadId,
        };
        const { thread } = await detailThread.execute(dataPayload);

        return h.response({
            status: 'success',
            data: {
                thread,
            },
        });
    }
}
module.exports = ThreadsHandler;