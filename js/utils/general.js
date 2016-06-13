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
    safeMerge,
    sanitize,
    sanitizeList,
    selectFromObject
} from 'js-utility-belt/es6';

/**
 * Escape HTML in a string so it can be injected safely using
 * React's `dangerouslySetInnerHTML`
 *
 * @param s the string to be sanitized
 *
 * Taken from: http://stackoverflow.com/a/17546215/597097
 */
export function escapeHTML(s) {
    return document.createElement('div').appendChild(document.createTextNode(s)).parentNode.innerHTML;
}
