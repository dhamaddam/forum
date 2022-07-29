const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentsRepository = require("../../Domains/comments/CommentsRepository");
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentsRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(addComment) {

        const { content, thread, owner } = addComment;

        const createdAt = new Date().toISOString();

        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: `INSERT INTO comments 
            VALUES ($1,$2,$3,$4,$5,$6) 
            RETURNING id, content, owner`,
            values: [id, thread, content, owner, 0, createdAt],
        };
        const result = await this._pool.query(query);
        return new AddedComment(result.rows[0]);
    }

    async delComment(comment) {
        const query = {
            text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
            values: [comment],
        };

        await this._pool.query(query);
    }

    async getCommentsThread(thread) {
        const query = {
            text: `SELECT 
            comments.id, 
            users.username, 
            comments.created_at as date, 
            comments.content,
            comments.is_deleted 
            FROM comments 
            LEFT JOIN users 
            ON users.id = comments.owner 
            WHERE thread_id = $1 
            ORDER BY comments.created_at ASC`,
            values: [thread],
        };

        const { rows } = await this._pool.query(query);
        return rows;
    }

    async checkExistsComment(comment) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [comment],
        };

        const result = await this._pool.query(query);
        if (result.rowCount === 0) {
            throw new NotFoundError('komentar tidak ditemukan');
        }
    }
    async verifyOwnerComment(comment, owner) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
            values: [comment, owner],
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new AuthorizationError('tidak bisa menghapus komentar ');
        }
    }
}

module.exports = CommentRepositoryPostgres;