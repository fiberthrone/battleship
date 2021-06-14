module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
  },
  extends: ["eslint:recommended", "prettier"],
  env: {
    node: true,
    es6: true,
  },
};
