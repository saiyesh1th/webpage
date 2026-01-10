/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                terminal: {
                    accent: 'rgb(var(--terminal-accent) / <alpha-value>)',
                    content: 'rgb(var(--terminal-content) / <alpha-value>)',
                    dim: 'rgb(var(--terminal-dim) / <alpha-value>)',
                    bg: 'rgb(var(--terminal-bg) / <alpha-value>)',
                },
            },
            fontFamily: {
                mono: ['"VT323"', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
