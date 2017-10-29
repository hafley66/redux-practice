import {get} from 'lodash';
export const
    getConfig = ({configs}) => (id) => configs[id],
    resolveConfig = ({}),
    isHot = (config) => get(config, 'hot') || get(config, 'devServer.hot');
