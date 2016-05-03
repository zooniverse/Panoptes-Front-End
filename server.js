const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3735;

// serve up compiled static assets if we're in production mode
app.use(express.static(__dirname + '/dist'));

app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, 'localhost', function onStart(err) {
  if (err) {
    console.log(err);
  } else {
    console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  }
});
