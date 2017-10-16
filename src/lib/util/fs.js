let {map, object} = require('lodash');
let glob = require('glob');
let yaml = require('js-yaml');

let {
    existsSync: exists,
    mkdirSync: mkdir,
    removeSync: rm,
    writeFileSync: write,
    ensureDirSync: ensureDir,
    mkdirsSync: mkdirs,
    writeJsonSync: writeJson,
    readFileSync: readFile,
    statSync: stat
} = require('fs-extra');

let {CoercePathFunction} = require('./path');

function path(fn) {
    return function withCoerced(first, ...args) {
        return fn(CoercePathFunction(first), ...args);
    };
}

let FSS;

let FS = {
    exists,
    mkdir,
    rm,
    ensureDir,
    mkdirs,
    writeJson,
    write,
    readFile,
    stat,
    tryWriteJson:(file, ...args) => {
        try {
            FSS.writeJson(file, ...args);
            return true;
        } catch (err) {
            return false;
        }
    },
    tryWrite: (file, ...args) => {
        try{
            FSS.write(file, ...args);
            return true;
        } catch (error) {
            return false;
        }
    },
    tryRm: file => {
        try {
            FSS.exists(file) && FSS.rm(file);
            return true;
        } catch (err) {
            return false;
        }
    },
    tryRequire: file => {
        try {
            return require(file);
        } catch(err) {
            return undefined;
        }
    },
    safeRequire: file => {
        try {
            return require(file);
        } catch(err) {
            return {};
        }
    },
    requireYaml: file => (yaml.load(FSS.readFile(file))),
    requireJson: file => (
        file && file.match(/\.json$/i)
            ? require(file.toString())
            : FSS.requireYaml(file)
    ),
    glob: glob.sync
};

FSS = object(map(
    FS,
    (fn, name) => [name, path(fn)]
));

module.exports = FSS;
