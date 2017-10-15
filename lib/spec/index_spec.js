let subj = require('../index'),
    {expect} = require('chai'),
    recursiveDescribe = require('./boilerplate').default;


recursiveDescribe.begin({
    'Can getState': {
        'returns the store state': ()=> expect(subj.getState()).to.not.be.empty
    }
});
