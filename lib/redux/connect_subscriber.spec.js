import connectTo, {convertToStandardForm} from './connect_subscriber';
import {store} from './store';
import {sinon, expect, recursiveDescribe} from '../spec/boilerplate';

let
    addReducer = (s,a)=>({
        a: s.a + (a.value ? a.value : 0),
        b: {
            c: s.b.c + (a.value ? a.value : 0)
        }
    }),

    testStore = store(addReducer, {
        a: 10,
        b: {
            c: 20
        }
    }),

    connect = connectTo(testStore),

    dispatchAdd = (v) => testStore.dispatch({
        type: 'add',
        value: v
    });

recursiveDescribe.file(__filename)({
    'there are two types of inputs accepted for mapStateToArgs': {
        'an array of path strings': () => {
            let shorthand = ['a', 'b.c'];
            let {queries, queries2args} = convertToStandardForm(shorthand);
            expect(queries2args)
                .to.deep.equal({
                    a: 'a',
                    'b.c': 'c'
                });
            expect(queries).to.equal(shorthand);
        },
        'a plain object of {[alias]: path}': () => {
            let shorthand = {
                'im_an_alias': 'a',
                'c': 'b.c'
            };
            let {queries, queries2args} = convertToStandardForm(shorthand);
            expect(queries2args)
                .to.deep.equal({
                    a: 'im_an_alias',
                    'b.c': 'c'
                });
            expect(queries).to.deep.equal(Object.values(shorthand));
        }

    },
    'connected subscribers are called when their queries change': () => {
        let subscriber =  ({a}) => {
            if(a === 10) {
                dispatchAdd(100);
            } else {
                expect(a).to.equal(110);
            }
        };
        let queries = ['a', 'b.c'];
        let sub = sinon.spy(subscriber);

        connect(queries)(sub);

        let callCount =
            ('one for initialization of the subscriber to current state', 1) +
            ('two for the changes on .a then .b.c', 2);

        expect(sub.callCount).to.equal(callCount);
    }
});


