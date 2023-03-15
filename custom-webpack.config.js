const webpack = require('webpack');

module.exports = {
    "plugins": [
        new webpack.IgnorePlugin({
            resourceRegExp: /^(fs|child_process)$/,
        })
    ]
}
