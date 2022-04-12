/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
    async addLike({
        id = 'like-123',
        threadId = 'thread-123',
        commentId = 'comment-123',
        owner = 'user-123',
        date = '2022-03-05T03:04:43.260Z'
    }) {
        const query = {
            text: 'INSERT INTO likes VALUES($1, $2, $3, $4, $5)',
            values: [id, threadId, commentId, owner, date]
        };

        await pool.query(query);
    },

    async checkLikeById(likeId) {
        const query = {
            text: 'SELECT * FROM likes WHERE id = $1',
            values: [likeId]
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM likes');
    }
}

module.exports = LikesTableTestHelper;