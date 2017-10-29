import {recursiveDescribeFile, expect, store as BaseStore} from './index';
import {selectors, actions, reducers} from '../index';
import path from 'path';

export const store = (rs) => BaseStore({
    ...rs,
    paths: reducers
});

let
    s,
    withContextPath = () => s.dispatch(addContextPath(__dirname));

let {
    addPath,
    addRelativePath,
    addContextPath,
    addBuildPath,
    addCachePath,
    addToBuildPath,
    addToCachePath
} = actions;

let {
    getPath,
    getBuildPath,
    getCachePath,
    resolvePath
} = selectors;

recursiveDescribeFile(__filename)({
    'Tests both action producers and reducers using selectors': {
        before: () => (s = store()),
        after: () => s = undefined,
        '.addPath': {
            'make sure paths can be added and retrieved': () => {
                let id = s.dispatch(addPath({value: '/hello/world'})).id;
                expect(id).to.be.a('number');
                expect( getPath( s.getState(), id ) ).to.not.be.undefined;
            }
        },
        '.addRelativePath': {
            'make sure relative paths can be added and retrieved': () => {
                let relativePathId = s.dispatch(addPath({value: '/hello/world'})).id;
                let record = s.dispatch(addRelativePath({
                    value: 'warudo',
                    relativePathId
                }));
                expect(record.id).to.be.a('number');
                expect(getPath(s.getState(), record.id)).to.not.be.undefined;
                expect(resolvePath(s.getState(), record.id)).to.equal('/hello/world/warudo');
            }
        },
        'contextual special paths': {
            before: withContextPath,
            '.addBuildPath': {
                'sets the build path': () => {
                    let value = 'output';
                    let record = s.dispatch(addBuildPath(value));
                    expect(record.id).to.be.a('number');

                    expect(
                        getBuildPath(s.getState()).value
                    ).to.equal(value);

                    expect(
                        resolvePath(s.getState(), record.id)
                    ).to.equal(path.resolve(__dirname, value));
                }
            },
            '.addCachePath': {
                'sets the cache path': () => {
                    let value = 'cache';
                    let record = s.dispatch(addCachePath(value));
                    expect(record.id).to.be.a('number');

                    expect(
                        getCachePath(s.getState()).value
                    ).to.equal(value);

                    expect(
                        resolvePath(s.getState(), record.id)
                    ).to.equal(path.resolve(__dirname, value));
                }
            },
            '.addToBuildPath': {
                'adds a path relative to the build path': () => {
                    let build = 'build', file = 'test.js';
                    s.dispatch(addBuildPath(build));
                    let record = s.dispatch(addToBuildPath({value: file}));
                    expect(
                        resolvePath(s.getState(), record.id)
                    ).to.equal(path.resolve(__dirname, build, file));
                }
            },
            '.addToCachePath': {
                'adds a path relative to the cache path': () => {
                    let build = 'build', file = 'test.json';
                    s.dispatch(addCachePath(build));
                    let record = s.dispatch(addToCachePath({value: file}));
                    expect(
                        resolvePath(s.getState(), record.id)
                    ).to.equal(path.resolve(__dirname, build, file));
                }
            }
        }
    }
});

