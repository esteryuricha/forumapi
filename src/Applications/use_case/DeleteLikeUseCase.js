class DeleteLikeUseCase {
    constructor({ threadRepository, commentRepository, likeRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._likeRepository = likeRepository;
    }

    async execute(useCasePayload) {
        await this._threadRepository.checkThreadById(useCasePayload.threadId);
        await this._commentRepository.checkCommentById(useCasePayload.commentId);

        await this._likeRepository.checkLikeOwnerByCommentId(useCasePayload.commentId, useCasePayload.owner);
        await this._likeRepository.deleteLikeByCommentIdAndOwner(useCasePayload.commentId, useCasePayload.owner);
    }
}

module.exports = DeleteLikeUseCase;