const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadsRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }
    async addThread(threads) {

        const { title, body, owner } = threads;
        const id = `thread-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4) RETURNING id,title,owner',
            values: [id, title, body, owner],
        };
        const result = await this._pool.query(query);
        return new AddedThread({...result.rows[0] });
    }

    async checkExistsThread(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        }

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('thread tidak ditemukan di database');
        }
    }
    async getDetailsThread(threadId) {
        const query = {
            text: 'SELECT threads.id,created_at as date, title, body, username FROM threads LEFT JOIN users ON users.id = threads.owner WHERE threads.id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        return result.rows[0];
    }
}

module.exports = ThreadsRepositoryPostgres;