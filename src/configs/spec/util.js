import {
    fixPublicPath,
    mapEntryToHash,
    expandSpecialRegexKeysIterator
} from '../util';

import {expect, recursiveDescribeFile} from '../../../spec/boilerplate';

const
    testFix = (input, output) =>
        expect(fixPublicPath(input)).to.equal(output),
    testMap = (input, output) =>
        expect(mapEntryToHash(input)).to.deep.equal(output),
    regexSource = ['a', 'aa', 'aaa' , 'ab', 'bbaa', 'react', 'redux', 'redux-thunk', 'react-redux','lodash'],
    testRegexExpand = (input, output) =>
        expect(
            expandSpecialRegexKeysIterator(regexSource)(input)
        ).to.have.members(output);

recursiveDescribeFile(__filename) ({
    '.fixPublicPath': {
        'ensures the publicPath begins and ends with a slash': () =>
            (
                testFix('build', '/build/'),
                testFix('/build', '/build/'),
                testFix('build/', '/build/'),
                testFix('/', '/')
            )
    },
    '.mapEntryToHash': {
        'ensures entrypoint is in the form of {[name-0]: <array of strings>,...}': ()=>
            (
                testMap(
                    ['a'],
                    {a: ['a']}
                ),
                testMap(
                    {a: 'entry1'},
                    {a: ['entry1']}
                ),
                testMap(
                    'a',
                    {a: ['a']}
                )
            )
    },
    '.expandSpecialRegexKeys': {
        'allows a special string to act as a regex. picks all matches relative to an array of source strings': () =>
            (
                testRegexExpand(
                    ['=~ a+'],
                    [ 'a', 'aa', 'aaa', 'ab', 'bbaa', 'react', 'react-redux', 'lodash']
                ),
                testRegexExpand(
                    ['=~ b+'],
                    ['ab', 'bbaa']
                ),
                testRegexExpand(
                    ['=~ (react|redux).*', 'lodash'],
                    ['react', 'redux', 'redux-thunk', 'react-redux', 'lodash']
                )
            )
    }
});
