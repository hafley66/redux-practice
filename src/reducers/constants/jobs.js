module.exports = (config, slice) => ({
    slice: {
        pre: (laterConfig) => (
            slice
                ? slice(laterConfig)
                : Promise.resolve(laterConfig)
        )
    }
});

