import Loader from '../loader';
import {expect, recursiveDescribeFile} from './index';
import path from 'path';

const test = (file, output) => expect(Loader(path.resolve(__dirname, 'fixtures', file))).to.deep.equal(output);

recursiveDescribeFile(__filename)({
    'Loader': {
        'loads js files': () => test('a.js', {HELLO: 'A'}),
        'loads json files': () => test('b.json', {HELLO: 'B'}),
        'loads yaml files': () => test('c.yaml', {HELLO:'C'}),
        'loads yml files': () => test('d.yml', {HELLO: 'D'})
    }
});
