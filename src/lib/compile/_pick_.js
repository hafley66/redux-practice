let {pick} = require('lodash');
module.exports = cfg => pick(cfg, [
    'entry',
    'output',
    'resolve',
    'module',
    'plugins',
    'context',
    'devtool',
    'hot',
    'records',
    'devServer',
    'externals',
    'watch',
    'debug',
    'stats'
]);
