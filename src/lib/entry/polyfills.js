module.exports = (config, arg = true) => {
    return {parent: {globals: arg ? ['babel-polyfill'] : []}};
};
