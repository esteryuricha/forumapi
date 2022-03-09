const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(addReply) {
        const { threadId, commentId, content, owner } = addReply;
        const id = `reply-${this._idGenerator()}`;
        const date = new Date().toISOString();
        const isDelete = false;

        const query = {
            text: 'INSERT INTO replies (id, thread_id, comment_id, content, owner, date, is_delete) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
            values: [id, threadId, commentId, content, owner, date, isDelete],
        };

        const result = await this._pool.query(query);
      
        return new AddedReply({ ...result.rows[0] });
    }

    async checkReplyById(replyId) {
        return replyId;
    }
}

module.exports = ReplyRepositoryPostgres;