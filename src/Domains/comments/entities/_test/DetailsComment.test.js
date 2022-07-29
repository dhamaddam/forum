const DetailsComment = require('../DetailsComment');

describe('A DetailThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {};

        expect(() => new DetailsComment(payload)).toThrowError('DETAILS_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            comments: {},
        };

        expect(() => new DetailsComment(payload)).toThrowError('DETAILS_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should returns comments data correctly', () => {
        const payload = {
            comments: [{
                    id: 'comment321',
                    username: 'user321',
                    date: '2022-08-08T07:19:09.775Z',
                    content: 'sebuah comment',
                    is_deleted: 0,
                },
                {
                    id: 'comment432',
                    username: 'user432',
                    date: '2022-08-08T07:26:21.338Z',
                    content: 'komentar yang lain tapi udah dihapus',
                    is_deleted: 1,
                },
            ],
        };

        const { comments } = new DetailsComment(payload);

        const expectedComment = [{
                id: 'comment321',
                username: 'user321',
                date: '2022-08-08T07:19:09.775Z',
                content: 'sebuah comment',
            },
            {
                id: 'comment432',
                username: 'user432',
                date: '2022-08-08T07:26:21.338Z',
                content: '**komentar telah dihapus**',
            },
        ];

        expect(comments).toEqual(expectedComment);
    });

    it('should create DetailComment object correctly', () => {
        const payload = {
            comments: [{
                    id: 'comment-_pby2_tmXV6bcvcdev8xk',
                    username: 'johndoe',
                    date: '2021-08-08T07:22:33.555Z',
                    content: 'sebuah comment',
                },
                {
                    id: 'comment-yksuCoxM2s4MMrZJO-qVD',
                    username: 'dicoding',
                    date: '2021-08-08T07:26:21.338Z',
                    content: '**komentar telah dihapus**',
                },
            ],
        };

        const { comments } = new DetailsComment(payload);

        expect(comments).toEqual(payload.comments);
    });
});