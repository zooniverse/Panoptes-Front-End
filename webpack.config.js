module.exports = {
  watch: true,
  context: __dirname + '/app',
  entry: {
    main: './main.cjsx'
  },
  output: {
    path: __dirname + '/public/build',
    filename: '[name].js',
    chunkFilename: '[id].bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.cjsx', '.coffee']
  },
  module: {
    loaders: [
      { test: /\.cjsx$/, loaders: ['coffee-loader', 'cjsx-loader'] },
      { test: /\.coffee$/, loader: 'coffee-loader' }
    ],
    noParse: [
      /^react$/
    ]
  },
  node: {
    fs: 'empty'
  },
  watchDelay: 0,
  devtool: 'eval-source-map'
};
