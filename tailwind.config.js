module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        cream:   "#F5F1E8",
        paper:   "#FBF9F4",
        ink:     "#23201C",
        muted:   "#57514A",
        faint:   "#8A8177",
        bronze:  "#8C6A3F",
        sand:    "#C8B08A",
        line:    "#E4DED1",
        char:    "#221F1B",
        charsoft:"#2E2A25",
      },
      fontFamily: {
        ar:    ['"IBM Plex Sans Arabic"', "system-ui", "sans-serif"],
        sans:  ['"IBM Plex Sans"', '"IBM Plex Sans Arabic"', "system-ui", "sans-serif"],
        serif: ['"IBM Plex Serif"', "Georgia", "serif"],
      },
      maxWidth: { shell: "1240px" },
    },
  },
  plugins: [],
};
