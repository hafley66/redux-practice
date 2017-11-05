module.exports = require('../../../../spec/boilerplate');
const {store: Store, recursiveDescribeFile, expect} = module.exports;
import reducers from '../../reducers';
import {actions as pathActions, reducers as pathReducers, selectors as pathSelectors} from '../../../paths';
import {BUILD, CONTEXT} from '../../../paths/selectors';
import {loadConfig, setConfig, updateConfig} from '../index';
import {getConfig, findOutputPath} from '../../selectors';
import path from 'path';

let s,
    S = () => Store({
        config: reducers,
        paths: pathReducers
    }),
    D = (...args) => s.dispatch(...args),
    state = () => s.getState(),
    testConfig = {
        value: {
            entry: 'a',
            context: __dirname,
            output: {path: 'build'}
        },
        pathId: null
    };

recursiveDescribeFile(__filename)({
    'actions': {
        before: () => (
            s = S(),
            D(pathActions.addHomePath(__dirname)),
            s
        ),
        'setConfig': {
            'assigns the config to a value': () => (
                D(setConfig(testConfig)),
                expect(
                    getConfig(state())
                ).to.deep.equals(testConfig)
            )
        },
        'updateConfig': {
            'updates the value of the config': () => (
                D(setConfig(testConfig)),
                D(updateConfig({
                    value: {
                        output: {
                            path: 'b'
                        }
                    }
                })),
                expect(
                    findOutputPath(getConfig(state()))
                ).to.deep.equal('b')
            )
        },
        'loadConfig': {
            before: () =>
                D(loadConfig({path: path.join(__dirname, 'fixtures', 'config.yaml')})),
            'loads a config file and sets up the special paths': () =>
                (
                    expect(getConfig(state())).to.deep.include({
                        value: {
                            output: {
                                path: 'build',
                                publicPath: '/'
                            },
                            cache: './build_cache',
                            context: './src'
                        }
                    }),

                    expect(
                        pathSelectors.getHomePath(state()).value
                    ).to.equal(__dirname),

                    expect(
                        pathSelectors.resolvePath(
                            state(),
                            CONTEXT
                        )
                    ).to.equal(path.join(__dirname, 'src')),

                    expect(
                        pathSelectors.resolvePath(state(), BUILD)
                    ).to.equal(path.join(__dirname, 'build'))
                )
        }
    }
});
