ejs = require('ejs');
fs = require('fs');

fs.readFile(process.env.SRC_HTML, function(error, f) {
    if (error) {
        console.log(error);
    } else {
        var out = ejs.compile(f.toString())({html: ""});
        fs.writeFile(process.env.BUILD_DIR + "/" + process.env.OUT_HTML, out, function(error) {
            if (error) {
                console.log(error);
            }
        });
    }
});

