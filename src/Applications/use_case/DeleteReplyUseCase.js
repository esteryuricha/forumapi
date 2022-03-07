const { use } = require("bcrypt/promises");

class DeleteReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        await this._threadRepository.checkThreadById(useCasePayload.threadId);
        await this._commentRepository.checkCommentById(useCasePayload.commentId);
        await this._replyRepository.checkReplyById(useCasePayload.replyId);
        await this._replyRepository.checkReplyOwner(useCasePayload.replyId, useCasePayload.owner);

        return this._replyRepository.deleteReply(useCasePayload.replyId);
    }
}

module.exports = DeleteReplyUseCase;