import {expect, store as Store, recursiveDescribeFile} from './index';
import {actions, reducers, selectors} from '../index';



let S = () => Store({expansions: reducers}),
    s,
    D = (...args) => s.dispatch(...args),
    state = () => s.getState(),
    dummyTransform = x => x + 2,
    set = (toSet) => D(actions.setExpansion(toSet)),
    add10 = (x) => x + 10,
    exp10 = (x) => x ** 10,
    addExp10 = (x) => exp10(add10(x)),
    transform = (key, arg) => selectors.getExpansion(state(), key).transform(arg);

recursiveDescribeFile(__filename)({
    'store': {
        before: () => (s = S()),
        after: ()=> s = undefined,
        '.reducers': {
            'will override existing expansions when keys collide': () => (
                set({
                    key: 'prop',
                    transform: dummyTransform
                }),
                set({
                    key: 'prop',
                    transform: add10
                }),
                expect(selectors.getExpansion(state(), 'prop'))
                    .to.deep.include({
                        transform: add10
                    })
            )
        },
        '.normalizeTransformPlainObject': {
            'Allows the transform argument to be an object with an expander and normlizer':{
                'when .normalizer is present': {
                    'composes .expander with .normalizer called as first arg': () => (
                        set({
                            key: 'prop',
                            transform: {
                                expander: exp10,
                                normalizer: add10
                            }
                        }),
                        expect(transform('prop', 0))
                            .to.equal(addExp10(0))
                    )
                },
                'when .normalizer is NOT present': {
                    'uses .expander as the transform': () => (
                        set({
                            key: 'prop',
                            transform: {
                                expander: add10
                            }
                        }),
                        expect(transform('prop', 0))
                            .to.equal(add10(0))
                    )
                }
            }
        }
    }
});
