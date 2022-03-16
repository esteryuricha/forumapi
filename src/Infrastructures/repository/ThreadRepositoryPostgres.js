const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(addThread) {
        const { title, body, owner } = addThread;
        const id = `thread-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, owner, date]
        };

        const result = await this._pool.query(query);

        return new AddedThread({...result.rows[0]});
    }

    async checkThreadById(threadId) {
        const query = {
          text: 'SELECT * FROM threads WHERE id = $1',
          values: [threadId],
        };
    
        const result = await this._pool.query(query);
    
        if (!result.rowCount) {
          throw new NotFoundError('Thread not found!');
        }
    
        return threadId;
    }

    async getDetailThread(threadId) {
        const query = {
            text: 'SELECT t.id, t.title, t.body, t.date, u.username FROM threads t INNER JOIN users u ON t.owner = u.id WHERE t.id = $1',
            values: [threadId]
        };

        const result = await this._pool.query(query);

        if(!result.rowCount) {
            throw new Error('Thread not Found!');
        }

        return { ... result.rows[0], comments: [] };
    }
};

module.exports = ThreadRepositoryPostgres;