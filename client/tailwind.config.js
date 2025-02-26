/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'gray-bright': '#F8F4EB',
                'gray-light': '#545454',
                'gray-medium': '#414141',
                'gray-dark': '#2c2c2c',
                'primary-100': '#FFE1E0',
                'primary-300': '#FFA6A3',
                'primary-500': '#FF6B66',
                'secondary-400': '#FFCD5B',
                'secondary-500': '#FFC132',
            },
            backgroundImage: (theme) => ({
                'gradient-yellowred':
                    'linear-gradient(90deg, #FF616A 0%, #FFC837 100%)',
                'mobile-home': "url('./assets/HomePageGraphic.png')",
            }),
            fontFamily: {
                dmsans: ['DM Sans', 'sans-serif'],
                montserrat: ['Montserrat', 'sans-serif'],
            },
            content: {
                evolvetext: "url('./assets/EvolveText.png')",
                abstractwaves: "url('./assets/AbstractWaves.png')",
                sparkles: "url('./assets/Sparkles.png')",
                circles: "url('./assets/Circles.png')",
            },
        },
        screens: {
            xs: '480px',
            sm: '768px',
            md: '1060px',
        },
    },
    plugins: [],
}
