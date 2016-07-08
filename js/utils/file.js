// Re-export related utilities from js-utility-belt for easier access
export {
    createTextFile,
    computeFileHash,
    extractFileExtensionFromString,
    extractFileExtensionFromUrl
} from 'js-utility-belt/es6/file';

/**
 * Transforms kb size to mb size, using an arbitrary rounding function at the end.
 *
 * @param  {number}   size    Size in kb
 * @param  {function} roundFn Function to round out the precise size in mb, defaulting to Math.ceil.
 * @return {number}           Size in mb
 */
export function kbToMb(size, roundFn = Math.ceil) {
    return roundFn(size / 1024);
}
