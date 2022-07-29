const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('A function DeleteCommentUseCase', () => {
    it('should throw error if dataPayload not contain thread_id and comment_id', async() => {
        const dataPayload = {};
        const deleteCommentUseCase = new DeleteCommentUseCase({});

        await expect(deleteCommentUseCase.execute(dataPayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    });

    it('should throw error if payload not string', async() => {
        const dataPayload = {
            thread: 1,
            comment: 1,
            owner: 1,
        };
        const deleteCommentUseCase = new DeleteCommentUseCase({});
        await expect(deleteCommentUseCase.execute(dataPayload))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the delete comment action correctly', async() => {

        const dataPayload = {
            thread: 'thread123',
            comment: 'comment-123',
            owner: 'user-123',
        };
        const mockCommentRepository = new CommentsRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.checkExistsThread = jest.fn().mockImplementation(() => Promise.resolve());

        mockCommentRepository.checkExistsComment = jest.fn().mockImplementation(() => Promise.resolve());

        mockCommentRepository.verifyOwnerComment = jest.fn().mockImplementation(() => Promise.resolve());

        mockCommentRepository.delComment = jest.fn().mockImplementation(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });
        await deleteCommentUseCase.execute(dataPayload);

        expect(mockThreadRepository.checkExistsThread).toHaveBeenCalledWith(dataPayload.thread);
        expect(mockCommentRepository.checkExistsComment).toHaveBeenCalledWith(dataPayload.comment);
        expect(mockCommentRepository.verifyOwnerComment).toHaveBeenCalledWith(dataPayload.comment, dataPayload.owner);
        expect(mockCommentRepository.delComment).toHaveBeenCalledWith(dataPayload.comment);
    });
});