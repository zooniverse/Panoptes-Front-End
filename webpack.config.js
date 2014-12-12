module.exports = {
  resolve: {
    extensions: ['', '.coffee', '.cjsx', '.js', '.jsx']
  },

  module: {
    loaders: [
      {test: /\.cjsx$/, loaders: ['coffee', 'cjsx']},
      {test: /\.coffee$/, loader: 'coffee'}
    ],

    noParse: [/^react$/, /json\-api\-client/]
  },

  node: {
    fs: 'empty'
  },

  devtool: 'source-map',
  watchDelay: 0
};
