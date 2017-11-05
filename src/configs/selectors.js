import {get} from 'lodash';
export const
    getConfig = ({config}) => config,
    findOutputPath = (config) => get(config, 'output.path'),
    findPublicPath = (config) => get(config, 'output.publicPath'),
    findContextPath = (config) => get(config, 'context'),
    findCachePath = (config) => get(config, 'cache'),
    isHot = (config) => get(config, 'hot') || get(config, 'devServer.hot');
