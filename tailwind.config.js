module.exports = {
  content: [
    "./src/**/*.html",
    "./src/**/*.js"
  ],
  // purge устарел в v3+, используй content выше
  // для prod purge работает автоматически при content
  theme: {
    extend: {},
  },
  plugins: [],
}
