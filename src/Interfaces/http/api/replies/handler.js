const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');

class RepliesHandler {
    constructor(container) {
        this._container = container;

        this.postReplyHandler = this.postReplyHandler.bind(this);
    }

    async postReplyHandler(request, h) {
        const { id: owner } = request.auth.credentials;
        const { threadId, commentId } = request.params;
        const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
        const addedReply = await addReplyUseCase.execute({ threadId, commentId, ...request.payload, owner });

        const response = h.response({
            status: 'success',
            data: {
                addedReply
            }
        });
        response.code(201);
        return response;

    }   
}

module.exports = RepliesHandler;