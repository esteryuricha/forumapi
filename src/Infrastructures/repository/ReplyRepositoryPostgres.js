const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const GetReply = require('../../Domains/replies/entities/GetReply');

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
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyId],
        };
      
        const result = await this._pool.query(query);
      
        if(!result.rowCount) {
            throw new NotFoundError('Reply not found!');
        }
      
        return replyId;
    }

    async checkReplyOwner(replyId, owner) {
        const query = {
            text: 'SELECT id FROM replies WHERE id = $1 and owner = $2',
            values: [replyId, owner]
        };

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new AuthorizationError("you are not the owner of the reply");
        }
    }

    async deleteReply(replyId) {
        const query = {
            text: 'UPDATE replies SET is_delete = true WHERE id = $1',
            values: [replyId]
        };

        const result = await this._pool.query(query);

        if(!result.rowCount) {
            throw new NotFoundError('Reply not found');
        }
    }

    async getReply(commentId) {
        const query = {
            text: 'SELECT r.id, u.username, r.date, r.content, r.is_delete FROM replies r INNER JOIN users u ON r.owner = u.id WHERE r.comment_id = $1 ORDER BY r.date ASC',
            values: [commentId]
        };

        const result = await this._pool.query(query);

        return result.rows.map((payload) => (
            new GetReply({
                id: payload.id,
                username: payload.username,
                date: payload.date,
                content: payload.content,
                isDelete: payload.is_delete
            })
        ));
    }
}

module.exports = ReplyRepositoryPostgres;