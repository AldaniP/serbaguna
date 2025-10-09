module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }], // penting!
    "@babel/preset-typescript",
  ],
};
