module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      '@babel/preset-env',
      ['@babel/preset-react', { runtime: 'automatic' }]
    ],
    env: {
      development: {
        plugins: [
          [
            '@babel/plugin-proposal-class-properties'
          ],
          [
            'transform-es2015-modules-commonjs'
          ]
        ]
      },
      staging: {
        plugins: [
          [
            '@babel/plugin-proposal-class-properties'
          ],
          [
            'transform-es2015-modules-commonjs'
          ]
        ]
      },
      production: {
        plugins: [
          [
            '@babel/plugin-proposal-class-properties'
          ],
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
            '@babel/plugin-proposal-class-properties'
          ],
          [
            'transform-es2015-modules-commonjs'
          ]
        ]
      }
    }
  };
};
