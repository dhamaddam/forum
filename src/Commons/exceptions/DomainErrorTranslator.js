const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
    translate(error) {
        return DomainErrorTranslator._directories[error.message] || error;
    },
};

DomainErrorTranslator._directories = {
    'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD': new InvariantError('tidak dapat menghapus komentar dikarenakan tidak memiliki properti yang dibutuhkan'),
    'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menghapus komentar dikarenakan tidak memiliki data properti yang sesuai'),
    'COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED': new InvariantError(' ada metode yang belum di implementasikan '),
    'DETAILS_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Details trehad tidak dapat di dapatkan karena properti yang dibtuhakn tidak sesuai'),
    'DETAILS_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Details Thread tidak dapat di dapatkan karena tidak ada properti yang dibutuhkan'),
    'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED': new InvariantError('Thread repository tidak terimplementasi '),
    'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan komentar baru dikarenakan tipe properti tidak sesuai'),
    'ADD_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan comment baru karena properti yang dibutuhkan tidak ada '),
    'ADD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan komentar baru dikarenakan tipe properti tidak sesuai'),
    'ADD_THREADS.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan thread baru karena tipe properti yang dibutuhkan tidak sesuai'),
    'ADD_THREADS.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahan thread baru karena prperty yang dibutuhkan tidak ada'),
    'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan thread baru karena tipe properti yang dibutuhkan tidak sesuai'),
    'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan thread baru karena properti yang dibutuhkan tidak ada'),
    'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
    'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
    'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
    'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
    'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
    'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
    'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
    'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
};

module.exports = DomainErrorTranslator;