export const
    getParentKey = (key) => key.split('.').slice(0, -1).join('.'),
    getExpansion = ({expansions}, key) => expansions[key],
    getExpansions = ({expansions}, keys) => keys.map(
        x=>getExpansion({expansions}, x)
    ),
    getAllExpansions = ({expansions}) => Object.values(expansions);
