import {forEach, isFunction, isPlainObject} from 'lodash';
import sinon from 'sinon';
import {expect} from 'chai';

let recursiveDescribe = (test, desc) => {
    if(isPlainObject(test)) {
        describe(`${ desc}`, () => {
            forEach(test, recursiveDescribe);
        });
    } else if(isFunction(test)) {
        it(`${desc}`, () => {
            test();
        });
    }
};

let recursiveDescribeBegin = (test) => (
    forEach(
        test,
        recursiveDescribe
    )
);

let recursiveDescribeFile = filename => (test) =>
    describe(
        `BEGIN : ${filename.replace(process.cwd(), '').toUpperCase()}`,
        () => {recursiveDescribe.begin(test);}
    );

recursiveDescribe.begin = recursiveDescribeBegin;
recursiveDescribe.file = recursiveDescribeFile;

export default recursiveDescribe;
export {recursiveDescribe, recursiveDescribeFile, sinon, expect, recursiveDescribeBegin};
