import {CONTEXT, BUILD, CACHE, PUBLIC_PATH, resolvePath, resolvePublicPath, getPaths, getPath} from '../selectors';
import {expect, recursiveDescribeFile} from './index';

const paths = () => ({
        [CONTEXT]: {
            id: CONTEXT,
            value: '/app'
        },
        [BUILD]: {
            id: BUILD,
            value:'/app/build'
        },
        [CACHE]: {
            id: CACHE,
            value: '/app/build_cache'
        },
        [PUBLIC_PATH]: {
            id: PUBLIC_PATH,
            value: '/build/'
        },
        'test1': {
            id: 'test1',
            value: 'test1',
            relativePathId: CONTEXT
        },
        'test2': {
            id: 'test2',
            value: '/app/test2',
            relativePathId: CONTEXT
        }
    }),
    state = () => ({paths: paths()}),
    testResolveFn = fn => (id) => fn(state(), id),
    testResolve = testResolveFn(resolvePath),
    testResolvePublic = testResolveFn(resolvePublicPath);

recursiveDescribeFile(__filename)({
    '.resolvePath': {
        'returns the value of the path when no relative': () =>
            expect(
                testResolve(CONTEXT)
            ).to.equal('/app'),
        'returns resolved paths relative to the path.value at relativeToId': () =>
            expect(
                testResolve('test1')
            ).to.equal('/app/test1'),
        'will not duplicate the path that it is relative to': () =>
            expect(
                testResolve('test2')
            ).to.equal('/app/test2')
    },
    '.resolvePublicPath': {
        'returns the value of the path relative to the public path': () =>
            expect(
                testResolvePublic('test1')
            ).to.equal('/build/test1')
    },
    '.getPaths': {
        'returns the path records from a list of ids': () => {
            let s = state();
            let g = getPath(s);
            let tester = getPaths(s);
            expect(
                Object.values(tester([
                    CONTEXT,
                    BUILD
                ]))
            ).to.deep.equals(
                [g(CONTEXT), g(BUILD)]
            );
        }
    }
});
