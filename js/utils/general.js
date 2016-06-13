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

/**
 * Takes a string and breaks it at the supplied index and replaces it
 * with a (potentially) short string that also has been provided
 * @param  {string} text        The string to truncate
 * @param  {number} charIndex   The char number at which the text should be truncated
 * @param  {String} replacement All text after charIndex will be replaced with this string
 * @return {string}             The truncated text
 */
export function truncateTextAtCharIndex(text, charIndex, replacement = '...') {
    let truncatedText = '';

    truncatedText = text.slice(0, charIndex);
    truncatedText += text.length > charIndex ? replacement : '';

    return truncatedText;
}

/**
 * @param index, int, the starting index of the substring to be replaced
 * @param character, substring to be replaced
 * @returns {string}
 */
export function replaceSubstringAtIndex(baseString, substrToReplace, stringToBePut) {
    let index = baseString.indexOf(substrToReplace);
    return baseString.substr(0, index) + stringToBePut + baseString.substr(index + substrToReplace.length);
}

/**
 * Extracts the user's subdomain from the browser's window.
 * If no subdomain is found (for example on a naked domain), the default "www" is just assumed.
 * @return {string} subdomain as a string
 */
export function getSubdomain() {
    let { host } = window.location;
    let tokens = host.split('.');
    return tokens.length > 2 ? tokens[0] : 'www';
}
