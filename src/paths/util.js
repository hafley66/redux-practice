export const
    isAbsolute = (path) => !!(path && path.match && path.match(/^\//)),
    isRelative = (path) => !isAbsolute(path);
