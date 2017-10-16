/* eslint-disable no-console */
const CND = (cnd, yay, boo, level = 'log') => {
    console[level](
        cnd
            ? (!!yay && yay || '')
            : (!!boo && boo || '')

    );
    return cnd;
};
Object.assign(CND, {
    n: (cnd, boo, yay) => CND(cnd, yay, boo)
});

module.exports = {
    cond: CND
};
