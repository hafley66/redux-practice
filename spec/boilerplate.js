import {omit, forEach, isFunction, isPlainObject} from 'lodash';
import sinon from 'sinon';
import {expect} from 'chai';
import {store} from '../src/lib/redux/store';

let recursiveDescribe = (test, desc) => {
    if(isPlainObject(test)) {
        describe(`${ desc}`, () => {
            if(test.before) beforeEach(test.before);
            if(test.after) afterEach(test.after);
            forEach(omit(test, 'before', 'after'), recursiveDescribe);
        });
    } else if(isFunction(test)) {
        it(`${desc}`, (done) => {
            let t = test(done);
            if(t && t.then && t.catch) t.then(done, done);
            else done();
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
export {recursiveDescribe, recursiveDescribeFile, sinon, expect, recursiveDescribeBegin, store};
