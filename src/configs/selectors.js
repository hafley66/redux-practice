import {get} from 'lodash';
export const
    getConfig = ({config}) => config,

    findPublicPath = (config) => get(config, 'output.publicPath'),
    findOutputPath = (config) => get(config, 'output.path'),
    findContextPath = (config) => get(config, 'context'),
    findCachePath = (config) => get(config, 'cache'),

    isHot = (config) => get(config, 'hot') || get(config, 'devServer.hot'),
    isUsingSourceMap = (c) => get(c, 'devtool') === 'source-map';
