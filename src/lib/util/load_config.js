let
    yaml = require('js-yaml'),
    pathFn = require('./path'),
    fs = require('fs'),
    glob = require('glob'),
    requireYaml = file => (yaml.load(fs.readFileSync(file))),
    extensions = [
        'js','yaml','yml'
    ];

const
    DEF_FOLDER = pathFn.cwd('webpack-config'),
    DEF_FILE_FN = (defFolder) => defFolder === DEF_FOLDER ? '{,/index}' : 'webpack-config';

let loader = ( defFolder = DEF_FOLDER ) => {
    return (filename =  DEF_FILE_FN(defFolder)) => {
        filename = pathFn(defFolder, filename).str();
        if(filename) {
            let globber = normalizeName(normalizeExtensions(filename));
            let matches = glob.sync(globber, {nobrace: false});

            if(matches.length) {
                return getConfig(matches[0]);
            } else {
                throw new Error('Couldnt find config file!');
            }

        } else {
            throw new Error('Must pass filenames!');
        }
    };

    function getConfig(fname) {
        if(fname.match(/\.ya?ml$/ig)) {
            return requireYaml(fname);
        } else if(fname.match(/\.js(on)?$/ig)) {
            return require(fname);
        }
    }

    function normalizeName(name) {
        if(!name.match(/^(\.|\/)/i) && hasWebpackConfigFolder()) {
            let newFolder = defFolder(name);
            return newFolder.toString();
        } else {
            return name;
        }
    }

    function normalizeExtensions(name) {
        if(name.match(/\.(js|ya?ml)$/i)) {
            return `${name}`;
        } else {
            return `${name}.@(${extensions.join('|')})`;
        }
    }

    function hasWebpackConfigFolder() {

        let folder = defFolder.toString(),
            exists =  fs.existsSync(folder);
        return exists;
    }
};

module.exports = loader();

exports.loaderFn = loader;
