module.exports = function (api) {
  api.cache.forever();

  const presets = ['@babel/preset-env'];
  const plugins = [];

  return {
    presets,
    plugins,
  };
};
