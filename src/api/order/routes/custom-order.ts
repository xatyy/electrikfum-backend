export default {
    routes: [
        {
            method: 'POST',
            path: '/orders/verifyPayment',
            handler: 'order.verifyPayment',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/orders/findOrder',
            handler: 'order.findOrder',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/orders/delivery',
            handler: 'order.delivery',
        },
        {
            method: 'GET',
            path: '/orders/count',
            handler: 'order.count'
        },
        {
            method: 'GET',
            path: '/orders/fetch',
            handler: 'order.fetch'
        },
        {
            method: 'GET',
            path: '/orders/fetchMy',
            handler: 'order.fetchMy'
        },
        {
            method: 'PUT',
            path: '/orders/update',
            handler: 'order.update'
        }
    ],
};