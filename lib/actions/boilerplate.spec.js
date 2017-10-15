import {expect} from 'chai';
import {strings2ConstantsHash } from './boilerplate';
import recursiveDescribe from '../spec/boilerplate';

let subject = strings2ConstantsHash;

recursiveDescribe.file(__filename)({
    '.strings2ConstantsHash': {
        'makes a list of strings into an object of those keys pointing to those values \n\tVIZ: ([A, B] => {[A]: A})' : ()=>(
            expect(
                subject(['A', 'B'])
            ).to.deep.equal({
                A: 'A',
                B: 'B'
            })
        ),
        'makes a list of strings recursively': () => (
            expect(
                subject({A: ['B']})
            ).to.deep.equal({A: {B: 'B'}})
        ),
        'even deeper': () => (
            expect(
                subject({A: {B: {C: ['D', 'E', 'F']}}})
            ).to.deep.equals({
                A: {
                    B: {
                        C: {
                            D: 'D',
                            E: 'E',
                            F: 'F'
                        }
                    }
                }
            })
        ),
        'mix and match': ()=> {
            expect(
                subject(['A', {B: ['C']}])
            ).to.deep.equals({
                A: 'A',
                B: {
                    C: 'C'
                }
            });
        }
    }
});

