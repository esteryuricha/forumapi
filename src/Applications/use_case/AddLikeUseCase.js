const AddLike = require('../../Domains/likes/entities/AddLike');

class AddLikeUseCase {
    constructor({ threadRepository, commentRepository, likeRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._likeRepository = likeRepository;
    }

    async execute(useCasePayload) {
        const addLike = new AddLike(useCasePayload);

        await this._threadRepository.checkThreadById(addLike.threadId);
        await this._commentRepository.checkCommentById(addLike.commentId);
        
        await this._likeRepository.addLike(addLike);
    }
}

module.exports = AddLikeUseCase;