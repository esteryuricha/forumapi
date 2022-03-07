/* istanbul ignore files */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async addReply({
        id = 'reply-123',
        commentId = 'comment-123',
        content = 'ini adalah balasan',
        owner = 'user-123',
        date = '2022-03-07T05:48:30.111Z'
    }) {
        const query = {
            text: 'INSERT INTO replies (id, comment_id, content, owner, date) VALUES($1, $2, $3, $4, $5)',
            value: [id, commentId, content, owner, date]
        };

        await pool.query(query);
    },

    async checkReplyById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id]
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async cleanTable() {
        await pool.query('TRUNCATE replies');
    }
};

module.exports = RepliesTableTestHelper;