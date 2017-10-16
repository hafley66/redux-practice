let DEFAULTS = {
    build: true,
    clean: true
};

module.exports = (config, slice)  => {
    let {build, clean, server} = slice || DEFAULTS;

    let acc = [];
    if(!server && build)
        acc.push('build', 'clean');
    if(!build && clean)
        acc.push('clean');
    return acc;
};
