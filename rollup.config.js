export default {
  input: "./src/index.js",
  output: [
    {
      file: "cjs.js",
      format: "cjs",
    },
    {
      file: "esm.js",
      format: "esm",
    },
  ],
  sourcemap: true,
};
