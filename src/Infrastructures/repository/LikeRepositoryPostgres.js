const LikeRepository = require('../../Domains/likes/LikeRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addLike(addLike) {
        const { threadId, commentId, owner } = addLike;
        const id = `like-${this._idGenerator()}`;
        const date = new Date().toISOString();
        const isDelete = false;

        const query = {
            text: 'INSERT INTO likes (id, thread_id, comment_id, owner, date, is_delete) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, comment_id, owner',
            values: [id, threadId, commentId, owner, date, isDelete],
        };

        const result = await this._pool.query(query);
      
        return result.rows[0];
    }

    async getLikeCountByCommentId(commentId) {
        const query = {
            text: `SELECT count(*) as likecount FROM likes WHERE comment_id = $1 AND is_delete = false`,
            values: [commentId]
        };

        const result = await this._pool.query(query);

        return result.rows[0].likecount;
    }

    async checkLikeOwnerByCommentId(commentId, owner) {
        const query = {
            text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
            values: [commentId, owner]
        };

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new AuthorizationError("you are not the owner of the like");
        }
    }

    async deleteLikeByCommentIdAndOwner(commentId, owner) {
        const query = {
            text: 'UPDATE likes SET is_delete = true WHERE comment_id = $1 AND owner = $2',
            values: [commentId, owner]
        };

        const result = await this._pool.query(query);

        if(!result.rowCount) {
            throw new NotFoundError('Like not found!');
        }
    }

}

module.exports = LikeRepositoryPostgres;