const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase');
const DeleteLikeUseCase = require('../../../../Applications/use_case/DeleteLikeUseCase');

class LikesHandler {
    constructor(container) {
        this._container = container;

        this.putLikeHandler = this.putLikeHandler.bind(this);
        this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    }

    async putLikeHandler(request, h) {
        const { id: owner } = request.auth.credentials;
        const { threadId, commentId } = request.params;

        const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name);
        await addLikeUseCase.execute({ threadId, commentId, owner });
    
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }

    async deleteLikeHandler(request, h) {
        const { id: owner } = request.auth.credentials;
        const { threadId, commentId } = request.params;
        const deleteLikeUseCase = this._container.getInstance(DeleteLikeUseCase.name);

        await deleteLikeUseCase.execute({ threadId, commentId, owner });
        
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;

    }
}

module.exports = LikesHandler;