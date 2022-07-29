const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

const CommentRepositoryPostgres = require("../CommentRepositoryPostgres")
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const AddComments = require("../../../Domains/comments/entities/AddComments");


describe("CommentRepositoryPostgres", () => {
    it("should be instance of Thread", () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

        expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepositoryPostgres);

    });

    describe("behavior test", () => {
        afterEach(async() => {
            await UsersTableTestHelper.cleanTable();
            await ThreadsTableTestHelper.cleanTable();
            await CommentsTableTestHelper.cleanTable();
        });


        afterAll(async() => {
            await pool.end();
        });

        describe("addComment Function", () => {

            it("should adding new Comment and return added comment correctly", async() => {
                await UsersTableTestHelper.addUser({ id: 'user123', username: 'user123' });
                await ThreadsTableTestHelper.addThread({ id: 'thread123', body: 'sebuah thread', owner: 'user123' });

                const addComment = new AddComments({
                    content: 'sebuah komentar',
                    thread: 'thread123',
                    owner: 'user123',
                });

                const fakeIdGenerator = () => '123';
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

                const addedComment = await commentRepositoryPostgres.addComment(addComment);
                const comment = await CommentsTableTestHelper.getCommentsById('comment-123');

                expect(addedComment).toStrictEqual(new AddedComment({
                    id: 'comment-123',
                    content: 'sebuah komentar',
                    owner: 'user123',
                }));
                expect(comment).toHaveLength(1);
            });
        });

        describe('deleteComment', () => {
            it('should delete comment from database ', async() => {
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({ id: 'user321', username: 'user321' });
                await ThreadsTableTestHelper.addThread({ id: 'thread321', body: 'sebuah thread', owner: 'user321' });
                await CommentsTableTestHelper.addComment({
                    id: 'comment123',
                    content: 'sebuah komentar',
                    thread: 'thread321',
                    owner: 'user321',
                });

                await commentRepositoryPostgres.delComment('comment123');

                const comment = await CommentsTableTestHelper.checkDeletedCommentsById('comment123');
                expect(comment).toEqual(true);

            });
        });

        describe('getCommentsThread', () => {
            it('should get comments of thread', async() => {
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                const userPayload = { id: 'user123', username: 'user123' };
                const threadPayload = {
                    id: 'thread123',
                    title: 'sebuah judul thread',
                    body: 'batang tubuh',
                    owner: 'user123',
                };
                const commentPayload = {
                    id: 'comment123',
                    content: 'sebuah komentar',
                    thread: threadPayload.id,
                    owner: userPayload.id,
                };

                await UsersTableTestHelper.addUser(userPayload);
                await ThreadsTableTestHelper.addThread(threadPayload);
                await CommentsTableTestHelper.addComment(commentPayload);

                const comments = await commentRepositoryPostgres.getCommentsThread(threadPayload.id);

                expect(Array.isArray(comments)).toBe(true);
                expect(comments[0].id).toEqual(commentPayload.id);
                expect(comments[0].username).toEqual(userPayload.username);
                expect(comments[0].content).toEqual('sebuah komentar');
                expect(comments[0].date).toBeDefined();
            });
        });

        describe('checkExistsComment function', () => {
            it('should throw NotFoundError if comment not available', async() => {

                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                const comment = 'xxx';

                await expect(commentRepositoryPostgres.checkExistsComment(comment)).rejects.toThrow(NotFoundError);
            });

            it('should not throw NotFoundError if comment available', async() => {

                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({
                    id: 'user-123',
                    username: 'user321'
                });
                await ThreadsTableTestHelper.addThread({
                    id: 'thread-123',
                    body: 'sebuah batang tubuh',
                    owner: 'user-123'
                });
                await CommentsTableTestHelper.addComment({
                    id: 'comment-123',
                    content: 'sebuah komentar',
                    thread: 'thread-123',
                    owner: 'user-123',
                });

                await expect(commentRepositoryPostgres.checkExistsComment('comment-123')).resolves.not.toThrow(NotFoundError);
            });
        });

        describe('verifyOwnerComments function', () => {
            it('should throw AuthorizationError if comment not belong to owner', async() => {

                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user123' });
                await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user456' });
                await ThreadsTableTestHelper.addThread({ id: 'thread-123', body: 'sebuah thread', owner: 'user-123' });
                await CommentsTableTestHelper.addComment({
                    id: 'comment-123',
                    content: 'sebuah komentar',
                    thread: 'thread-123',
                    owner: 'user-123',
                });
                const comment = 'comment-123';
                const owner = 'user-456';

                await expect(commentRepositoryPostgres.verifyOwnerComment(comment, owner))
                    .rejects.toThrow(AuthorizationError);
            });

            it('should not throw AuthorizationError if comment is belongs to owner', async() => {

                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user123' });
                await ThreadsTableTestHelper.addThread({ id: 'thread-123', body: 'sebuah thread', owner: 'user-123' });
                await CommentsTableTestHelper.addComment({
                    id: 'comment-123',
                    content: 'sebuah komentar',
                    thread: 'thread-123',
                    owner: 'user-123',
                });

                const comment = 'comment-123';
                const owner = 'user-123';
                await expect(commentRepositoryPostgres.verifyOwnerComment(comment, owner)).resolves.not.toThrow(AuthorizationError);
            });
        });

    });
});