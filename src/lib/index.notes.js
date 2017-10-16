/* eslint-disable no-unused-vars, no-undef, no-unused-labels*/
const {
    isArray,
    isPlainObject
} = require('lodash');


const CommonSpecifiers = {
    implicits: {
        vendor: true,
        common: true
    },
    manifest: true,
    CommonChunkArgs
};

const DllConfig = {
    build: '',
    public: '',
    nameTemplate: ''
};


const Methods = {
    cleanCaches() {

    },
    dlls: {
        cacheCheck(){

        }
    },
    scripts: {
        toPug() {

        },
        toHTML(){

        }
    },
    server: {
        toExpressApp({port = 8081} = {}) {

        },
        toExpressProxy({port = 8081} = {}) {

        },
        toWebpackDevServer({port = 8081} = {}) {

        }
    }
};



module.exports = (webpackConfig = {}) => {
    const {
        splits: {
            dlls = {dllName: [libStrings]},
            extract = Boolean | ExtractConfig,
            commons = Collection,CommonSpecifiers,
            implicit = Boolean | {
                vendors: true,
                commons: true
            },
            bootloader = Boolean
        },
        caches: {
            build = String,
            client = Boolean,
            compilers: {babel, uglify},
            records
        },
        compressions: {
            minify = Boolean | UglifyConfig | {
                css: true | CSSNanoConfig,
                js: true | UglifyConfig
            },
            gzip = Boolean | CompressionConfig
        },
        styles: {
            autoprefix = Boolean | autoprefixConfig,
            globals = {}
        },
        loaders: {
            styles,
            scripts
            media,
            files
        },
        linters =  {
            css: true,
            js: true
        },
        tests
    } = webpackConfig;
};
