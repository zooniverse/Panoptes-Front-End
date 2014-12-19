var webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['', '.coffee', '.cjsx', '.js', '.jsx']
  },

  module: {
    loaders: [
      {test: /\.cjsx$/, loaders: ['coffee', 'cjsx']},
      {test: /\.coffee$/, loader: 'coffee'}
    ],

    noParse: [
      /^react$/,
      /json\-api\-client/
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],

  node: {
    fs: 'empty'
  },

  devtool: '#eval-source-map',
  watchDelay: 0
};
