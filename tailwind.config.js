const colors = require("tailwindcss/colors");

module.exports = {
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                gray: colors.neutral,
                primary: colors.sky,
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
    safelist: [
        { pattern: /bg-[a-z]+-[0-9]+/ },
        { pattern: /text-[a-z]+-[0-9]+/ },
        { pattern: /text-[a-z]+/ },
        { pattern: /font-[a-z]+/ },
        "italic",
    ]
};
