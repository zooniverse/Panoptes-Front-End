import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.dev.js';
import DashboardPlugin from 'webpack-dashboard/plugin';

const port = process.env.PORT || 3735;
const host = process.env.HOST || "localhost";

const app = express();
const compiler = webpack(config);
compiler.apply(new DashboardPlugin());
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  noInfo: true,
  stats: {
    colors: true
  }
});

app.use(middleware);

if (process.env.BABEL_ENV === 'hot-reload') {
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use(function(req,res,next){
   res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
   res.end();
})

app.listen(port, host, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  console.info('==> 🕓 Please wait for webpack to finish processing your application code.');
});
