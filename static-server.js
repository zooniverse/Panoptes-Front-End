const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3735;

const DEVELOPMENT_HOSTS = ['localhost', 'local.zooniverse.org'];

// serve up compiled static assets if we're in production mode
app.use(express.static(__dirname + '/dist'));

app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


DEVELOPMENT_HOSTS.forEach((host) => {
  app.listen(port, host, function onStart(err) {
    if (err) {
      console.log(err);
    } else {
      console.info('==> 🌎 Listening on port %s. Open up http://%s:%s/ in your browser.', port, host, port);
    }
  });
});
