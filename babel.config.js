module.exports = function (api) {
  api.cache(true);
  return {
    sourceType: 'module',
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: false
        }
      ]
    ],
    presets: [
      '@babel/preset-env',
      ['@babel/preset-react', { runtime: 'automatic' }]
    ],
    env: {
      test: {
        plugins: [
          [
            'babel-plugin-rewire'
          ]
        ]
      }
    }
  };
};
