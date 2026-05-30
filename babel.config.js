module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated 4 moved its babel plugin into the separate worklets package.
      // Keep this LAST in the plugins list.
      'react-native-worklets/plugin',
    ],
  };
};
