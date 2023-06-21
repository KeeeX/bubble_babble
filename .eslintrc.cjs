module.exports = require("@keeex/eslint-config")({
  base: true,
  promise: false,
  jsx: false,
  import: true,
  reacthooks: false,
  reactnative: false,
  typescript: "./tsconfig.json",
  tsdoc: false,
  deprecation: true,
  mocha: true,
});
