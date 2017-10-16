module.exports = (assetFinder, dllFinder, commonFiles = ['webpack_manifest', 'implicit_vendors', 'implicit_commons']) => {
    let getOrderingForFileTypes = {};
    ['js', 'css'].forEach((type) => {
        getOrderingForFileTypes[type] = (file, mode = 1, toReturn) => (
            console.log('The mode...', mode),
            [dllFinder, assetFinder].forEach(x=>x && x.setTo.mode(mode)),
            toReturn = [
                ...(dllFinder ? dllFinder[`all:${type}`]() : []),
                ...(commonFiles
                    .concat(file)
                    .map(x => assetFinder[type](`${x}`)))
            ].filter(x => Boolean(x)),
            [dllFinder, assetFinder].forEach(x=>x && x.setTo.restore()),
            toReturn
        );
    });

    return getOrderingForFileTypes;
};
