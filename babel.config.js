module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    env: {
      development: {
        plugins: [
          [
            '@babel/plugin-proposal-class-properties'
          ],
          [
            '@babel/plugin-proposal-object-rest-spread'
          ],
          [
            '@babel/plugin-transform-react-jsx'
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
            '@babel/plugin-proposal-object-rest-spread'
          ],
          [
            '@babel/plugin-transform-react-jsx'
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
            '@babel/plugin-proposal-object-rest-spread'
          ],
          [
            '@babel/plugin-transform-react-jsx'
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
            '@babel/plugin-proposal-object-rest-spread'
          ],
          [
            '@babel/plugin-transform-react-jsx'
          ],
          [
            'transform-es2015-modules-commonjs'
          ]
        ]
      }
    }
  };
};
