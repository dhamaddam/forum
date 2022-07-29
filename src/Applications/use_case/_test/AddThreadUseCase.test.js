const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
    it("should orchestrating the add thread activities correctly", async() => {
        const useCaseAddthreadPayload = {
            title: 'sebuah judul',
            body: 'batang tubuh',
            owner: 'user123',
        };

        const expectedAddedThread = new AddedThread({
            id: "thread123",
            title: useCaseAddthreadPayload.title,
            body: useCaseAddthreadPayload.body,
            owner: useCaseAddthreadPayload.owner,
        });

        const mockThreadRepository = new ThreadRepository();


        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedThread));

        const getThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        const addedThread = await getThreadUseCase.execute(useCaseAddthreadPayload);

        expect(addedThread).toStrictEqual(expectedAddedThread);

        expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
            title: useCaseAddthreadPayload.title,
            body: useCaseAddthreadPayload.body,
            owner: useCaseAddthreadPayload.owner,
        }));
    });
});