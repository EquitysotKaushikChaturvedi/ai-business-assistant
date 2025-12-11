/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#4F46E5",
                secondary: "#6366F1",
                accent: "#10B981",
                bgLight: "#F9FAFB",
                bgCard: "#FFFFFF",
                textDark: "#111827",
                textSoft: "#6B7280",
                error: "#DC2626",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
