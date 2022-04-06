/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper =  {
    async addComment({
        id = 'comment-123',
        threadId = 'thread-123',
        content = 'ini adalah content',
        owner = 'user-123',
        date = '2022-03-05T03:48:30.111Z'
    }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
            values: [id, threadId, content, owner, date]
        };

        await pool.query(query);
    },

    async checkCommentById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id]
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments');
    }
}

module.exports = CommentsTableTestHelper;