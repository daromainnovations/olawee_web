
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html","./src/**/*.{js,jsx,ts,tsx}"],
  prefix: "tw-",
  corePlugins: { preflight: false },
  important: true,            // <--- añade esto
  theme: { extend: {} },
  plugins: [],
};
