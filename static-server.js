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

let selfsigned
try {
  selfsigned = require('selfsigned')
} catch (error) {
  console.error(error)
}

DEVELOPMENT_HOSTS.forEach((host) => {
  const https = require('https')

  const attrs = [{ name: 'commonName', value: host }];
  const { cert, private: key } = selfsigned.generate(attrs, { days: 365 })
  https.createServer({ cert, key }, app).listen(port, host, function onStart(err) {
    if (err) {
      console.log(err);
    } else {
      console.info('==> 🌎 Listening on port %s. Open up https://%s:%s/ in your browser.', port, host, port);
    }
  });
});
