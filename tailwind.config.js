
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./public/index.html","./src/**/*.{js,jsx,ts,tsx}"],
  prefix: "tw-",
  corePlugins: { preflight: false },
  important: true, // <-- esto hace que .tw-* lleve !important
  theme: { extend: {} },
  plugins: [],
};