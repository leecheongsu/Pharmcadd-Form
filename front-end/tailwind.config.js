module.exports = {
    purge: {
        content: [
            './pages/**/*.{js,ts,jsx,tsx}',
            './components/**/*.{js,ts,jsx,tsx}',
            './layouts/**/*.{js,ts,jsx,tsx}',
        ],
        safelist: [
            'bg-primary',
            'text-xs',
            'text-sm',
        ],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            sans: 'Noto Sans KR',
        },
        screens: {
            'tablet': '640px',
            // => @media (min-width: 640px) { ... }
            'laptop': '1024px',
            // => @media (min-width: 1024px) { ... }
            'desktop': '1280px',
            // => @media (min-width: 1280px) { ... }
        },
        extend: {
            colors: {
                primary: '#727cf5',
            },
            boxShadow: {
                base: '0 0 35px 0 rgb(154 161 171/15%)',
            },
        },
    },
    variants: {},
    plugins: [],
}
