const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment123',
        content = 'sebuah komentar',
        thread = 'thread123',
        owner = 'user123',
        isDeleted = false,
    }) {
        const query = {
            text: "INSERT INTO comments VALUES ($1,$2,$3,$4,$5) RETURNING id",
            values: [id, thread, content, owner, isDeleted]
        };
        await pool.query(query);
    },

    async delComment(id) {
        const query = {
            text: 'UPDATE comments SET is_deleted = 1 WHERE id = $1',
            values: [id],
        };
        await pool.query(query);
    },

    async checkDeletedCommentsById(id) {
        const query = {
            text: 'SELECT is_deleted FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        const isDeleted = result.rows[0].is_deleted;
        return isDeleted;
    },

    async getCommentsById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
}

module.exports = CommentsTableTestHelper;