module.exports = function (api) {
  api.cache(true);
  return {
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
      development: {
        plugins: [
          [
            'transform-es2015-modules-commonjs'
          ]
        ]
      },
      staging: {
        plugins: [
          [
            'transform-es2015-modules-commonjs'
          ]
        ]
      },
      production: {
        plugins: [
          [
            'transform-es2015-modules-commonjs'
          ]
        ]
      },
      test: {
        plugins: [
          [
            'babel-plugin-rewire'
          ],
          [
            'transform-es2015-modules-commonjs'
          ]
        ]
      }
    }
  };
};
