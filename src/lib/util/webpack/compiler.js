/* eslint-disable no-console */
let webpack = require('webpack');
let outputWith = require('./output');
module.exports = (config) => {
    let instance = webpack(config);
    instance.runPromise = () => new Promise((resolve, reject) => instance.run(outputWith(config, instance, resolve, reject)));
    return instance;
};

