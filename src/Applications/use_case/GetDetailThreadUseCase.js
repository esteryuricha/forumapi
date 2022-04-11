class GetDetailThreadUseCase {
    constructor({ threadRepository, commentRepository, likeRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._likeRepository = likeRepository;
    }

    async execute(useCasePayload) {
        const { threadId } = useCasePayload;
        const thread = await this._threadRepository.getDetailThread(threadId);
        thread.comments = await this._commentRepository.getComment(threadId);

        const threadReplies = await this._threadRepository.getRepliesByThreadId(threadId);
        thread.comments = this._mappingRepliesByComments(thread.comments, threadReplies);

        //get like count
        thread.comments = await this._getLikeCountByComment(thread.comments);        

        return thread;
    }

    _mappingRepliesByComments(comments, threadReplies) {
        for(let i = 0; i < comments.length; i++ ) {
            const commentId = comments[i].id;
            comments[i].replies = threadReplies
                .filter((reply) => 
                    reply.commentId === commentId
                )
                .map((reply) => {
                    const { comment_id, ...replyDetail } = reply;
                    replyDetail.content = replyDetail.is_delete ? '**balasan telah dihapus**' : replyDetail.content;
                    delete replyDetail.is_delete;
                    delete replyDetail.commentId;
                    return replyDetail;
                });
                
        }
        return comments;
    }

    async _getLikeCountByComment(comments) {
        for(let i = 0; i < comments.length; i++) {
            const commentId = comments[i].id;
            comments[i].likeCount = Number(await this._likeRepository.getLikeCountByCommentId(commentId));
        }
        return comments;
    }
}

module.exports = GetDetailThreadUseCase;