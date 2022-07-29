const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const pool = require("../../database/postgres/pool");
const ThreadsRepositoryPostgres = require("../ThreadsRepositoryPostgres");

describe('ThreadsRepositoryPostgres', () => {
    it('should be instance of ThreadRepository domain', () => {
        const threadRepositoryPostgres = new ThreadsRepositoryPostgres({}, {}); // Dummy dependency

        expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
    });

    describe('behavior test', () => {
        afterEach(async() => {
            await ThreadsTableTestHelper.cleanTable();
            await UsersTableTestHelper.cleanTable();

        });

        afterAll(async() => {
            await pool.end();
        });

        describe('addThread function', () => {
            it('should persist adding thread and return ThreadDetails correctly', async() => {

                await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user123' });

                const threadDetails = new AddThread({
                    title: 'Sebuah thread',
                    body: 'batang tubuh',
                    owner: 'user-123',
                });
                const fakeIdGenerator = () => '123';
                const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);
                await threadsRepositoryPostgres.addThread(threadDetails);

                const thread = await ThreadsTableTestHelper.checkExistsThread('thread-123');
                expect(thread).toHaveLength(1);
            });
        });


        describe('checkAvailabilityThread function', () => {
            it('should throw NotFoundError if thread not available', async() => {

                const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});
                const threadId = 'xxx';

                await expect(threadsRepositoryPostgres.checkExistsThread(threadId))
                    .rejects.toThrow(NotFoundError);
            });

            it('should not throw NotFoundError if thread available', async() => {

                const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user123' });
                await ThreadsTableTestHelper.addThread({ id: 'thread123', body: 'sebuah thread', owner: 'user-123' });

                await expect(threadsRepositoryPostgres.checkExistsThread('thread123'))
                    .resolves.not.toThrow(NotFoundError);
            });
        });

        describe('getDetailsThread function', () => {
            it('should get detail thread and return coreeclty', async() => {
                const threadsRepository = new ThreadsRepositoryPostgres(pool, {});
                const userPayload = { id: 'user-123', username: 'user1123' };
                const threadsPayload = {
                    id: 'thread123',
                    title: 'sebuah thread',
                    body: 'sebuah batang tubuh',
                    owner: 'user-123',
                };
                await UsersTableTestHelper.addUser(userPayload);
                await ThreadsTableTestHelper.addThread(threadsPayload);

                const detailThread = await threadsRepository.getDetailsThread(threadsPayload.id);

                expect(detailThread.id).toEqual(threadsPayload.id);
                expect(detailThread.title).toEqual(threadsPayload.title);
                expect(detailThread.body).toEqual(threadsPayload.body);
                expect(detailThread.username).toEqual(userPayload.username);
            });
        });

    });

});