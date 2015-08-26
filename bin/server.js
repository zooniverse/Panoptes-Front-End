#!/usr/bin/env node

var static = require('node-static');

var port = process.env['PORT'],
    host = process.env['HOST'],
    dir = process.env['DEV_DIR'];

var fileServer = new static.Server(dir);

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response, function (e, res) {
            if (e && (e.status === 404)) { // If the file wasn't found
                fileServer.serveFile('/index.html', 200, {}, request, response);
            }
        });
    }).resume();
}).listen(port, host);
