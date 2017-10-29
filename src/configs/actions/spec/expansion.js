import {expect, recursiveDescribeFile} from './index';
import {handleExpansionOutput, ParentOverrideError, SCOPED_KEYS} from '../expansion';

let
    testKey = 'a.b.c',
    testState = () => ({
        a: {
            b: {}
        }
    }),
    testHandleOutput = (output, toEqual) =>
        expect(handleExpansionOutput(testState(), testKey, output))
            .to.deep.equal(toEqual);

recursiveDescribeFile(__filename)({
    '.handleExpansionOutput': {
        [`when given an object with any keys in ${  SCOPED_KEYS.join(',')}`]: {
            'handles merging the keys in specific order': () => (
                testHandleOutput({
                    global: { a: { 'bb': 'I am a new property' } },
                    parent: { cc: 'I am at a.b.cc' },
                    local: 'I am at a.b.c'
                },
                {
                    a: {
                        bb: 'I am a new property',
                        b: {
                            c: 'I am at a.b.c',
                            cc: 'I am at a.b.cc'
                        }
                    }
                })
            ),
            'when output has .parent': {
                'it does not allow .parent to be a truthy non-object': () =>
                    expect(
                        () => handleExpansionOutput(testState(), testKey, {
                            parent: 1
                        })
                    ).to.throw(ParentOverrideError)
            }
        },
        'when not given an object with some SCOPED_KEYS': {
            'handles merging the output at the key': () =>
                testHandleOutput(
                    {d: 'I am at a.b.c.d'},
                    { a: { b: {c: { d: 'I am at a.b.c.d'}}}}
                )
        }
    }
});
