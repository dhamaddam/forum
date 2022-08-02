const CommentsRepository = require("../../../Domains/comments/CommentsRepository");
const AddComments = require("../../../Domains/comments/entities/AddComments");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddCommentUseCase ", () => {

    it("should orchestra the add comment action correclty ", async() => {
        const dataPayload = {
            thread: 'thread321',
            content: 'sebuah komentar',
            owner: 'user321',
        };

        const expectedAddedComment = new AddedComment({
            id: "comment321",
            content: "sebuah komentart",
            owner: "user321",
        });

        const mockCommentRepository = new CommentsRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.checkExistsThread = jest.fn(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn(() => Promise.resolve(expectedAddedComment));

        const getCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        const addedComment = await getCommentUseCase.execute(dataPayload);

        expect(mockThreadRepository.checkExistsThread).toBeCalledWith(dataPayload.thread);
        expect(addedComment).toStrictEqual(expectedAddedComment);
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComments({
            thread: dataPayload.thread,
            content: dataPayload.content,
            owner: dataPayload.owner,
        }));
    });
});