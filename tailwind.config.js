/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nordeste: {
          laranja: '#E8620A',
          amarelo: '#F5A623',
          marrom:  '#5C2D0A',
          creme:   '#FDF3E3',
          verde:   '#2D6A4F',
        }
      }
    },
  },
  plugins: [],
}
