export const config = {
    port: process.env.PORT || 5000,
    corsOption: {
        origin: '*',
        methods: 'GET, POST',
        preflightContinue: false,
        allowedHeaders: '*'
    },
}