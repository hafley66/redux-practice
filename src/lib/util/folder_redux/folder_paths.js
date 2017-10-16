let pathFn = require('../path');

class CannotResolveFolderPathError extends Error {}
let err = path => {throw new CannotResolveFolderPathError(`Cannot resolve reducer from path. Given --> ${path.toString()}. \nSee Error trace above`);};

let swapMetaWithFolder = (path, folder) => path.replace(/^meta\./g, `${folder}.`)
    ,
    dots2slashes = (cwd, dotPath) => pathFn.resolve(cwd, ...dotPath.split('.'))
    ,
    relativeResolve = (cwd, targetFolder) => (dotPath) => {
        try {
            let file = dots2slashes(cwd, swapMetaWithFolder(dotPath, targetFolder));
            return require(file.toString());
        } catch (error) {
            console.log(error);
            err(dotPath);
        }
    }
    ;

module.exports =  relativeResolve;
