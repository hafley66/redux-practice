let reduce = require('./reduce');
let {merge} = require('lodash');
module.exports = (api, resolve) => (state, parent, children) =>
    (
        children.reduce(
            reduce(
                merge(
                    {},
                    api,
                    {resolve}
                )
            )(parent)
            ,
            state
        )
    )
;
