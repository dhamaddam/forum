const routes = (handler) => ([{
        method: 'POST',
        path: '/threads',
        handler: handler.postThreadsHandler,
        options: {
            auth: 'forum_jwt',
        }
    },
    {
        method: 'GET',
        path: '/threads/{threadId}',
        handler: handler.getDetailThreadHandler,
    },
]);

module.exports = routes;