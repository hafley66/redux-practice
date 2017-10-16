let folderResolver = require('./folder_paths');
let apiFn = require('./api');
let compose = require('./compose');


let DEFAULTS = () => ({
    targetFolder: 'lib',
    api: apiFn()
});

let D = DEFAULTS();

module.exports = (config, parent = 'meta', children = [], {cwd = process.cwd(), targetFolder = D.targetFolder, api = D.api} = D) =>
    (
        compose(
            api,
            folderResolver(cwd, targetFolder)
        )(config, parent, children)
    )
;

module.exports.compose = compose;
