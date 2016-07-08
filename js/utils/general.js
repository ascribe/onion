/**
 * Checks shallow equality
 * Re-export of shallow from shallow-equals
 */
export { default as isShallowEqual } from 'shallow-equals';

// Re-export general utilities from js-utility-belt for easier access
export {
    deepMatchObject,
    intersectLists,
    omitFromObject,
    safeInvoke,
    safeMerge,
    sanitize,
    sanitizeList,
    selectFromObject
} from 'js-utility-belt/es6';
