module.exports = {
    async rewrites() {
        return [
            {
                source: '/oauth/:path*',
                destination: `${process.env.API_URL}/oauth/:path*`,
            },
            {
                source: '/backapi/:path*',
                destination: `${process.env.API_URL}/:path*`,
            },
        ]
    }
}
