/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                silver: {
                    50: '#fcfcfd',
                    100: '#f4f5f8', // Soft white-silver
                    200: '#e5e7eb',
                    300: '#d7dadf',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    800: '#27272a', // Softer charcoal
                    900: '#18181b',
                },
                pastel: {
                    pink: '#ffe4e6', // Rose-100
                    pinkLight: '#fff1f2', // Rose-50
                    pinkDeep: '#fda4af', // Rose-300
                    purple: '#f3e8ff', // Purple-100
                    blue: '#e0f2fe', // Sky-100
                    glow: 'rgba(255, 228, 230, 0.5)', // Soft pink glow
                }
            }
        },
    },
    plugins: [],
}
