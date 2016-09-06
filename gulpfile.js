var GulpKit = require('gulpkit');

GulpKit(function(kit) {
    kit.scss({
        source: 'scss/app.scss',
        output: 'css/style.css'
    })
});