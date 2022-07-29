const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase Functions', () => {

    it('should get return detail thread correctly', async() => {
        const useCasePayload = {
            thread: 'thread123',
        };
        const expectedThread = {
            id: 'thread123',
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: '2021-10-18 14.00',
            username: 'user123',
        };

        const expectedComment = [{
                id: 'comment456',
                username: 'user456',
                date: '2021-10-18 14.00',
                content: 'sebuah comment',
                is_deleted: 0,
            },

            {
                id: 'comment789',
                username: 'user789',
                date: '2021-10-18 14.00',
                content: 'sebuah comment',
                is_deleted: 1,
            },
        ];

        const mockThreadRepository = new ThreadRepository();

        const mockCommentRepository = new CommentsRepository();

        mockThreadRepository.checkExistsThread = jest.fn(() => Promise.resolve());


        mockThreadRepository.getDetailsThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedThread));


        mockCommentRepository.getCommentsThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedComment));

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,

            commentRepository: mockCommentRepository,
        });

        const detailThread = await detailThreadUseCase.execute(useCasePayload);


        expect(mockThreadRepository.getDetailsThread)
            .toHaveBeenCalledWith(useCasePayload.thread);


        expect(mockCommentRepository.getCommentsThread)
            .toHaveBeenCalledWith(useCasePayload.thread);

        expect(detailThread).toStrictEqual({
            thread: {
                id: 'thread123',
                title: 'sebuah thread',
                body: 'sebuah body thread',
                date: '2021-10-18 14.00',
                username: 'user123',
                comments: [{
                        id: 'comment456',
                        username: 'user456',
                        date: '2021-10-18 14.00',
                        content: 'sebuah comment',
                    },
                    {
                        id: 'comment789',
                        username: 'user789',
                        date: '2021-10-18 14.00',
                        content: '**komentar telah dihapus**',
                    },
                ],
            },
        });
    });
});