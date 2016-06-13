// Re-export related utilities from js-utility-belt for easier access
export { getCurrentQueryParams, stringifyAsQueryParam, parseQueryParamStr } from 'js-utility-belt/es6/url';

/**
 * Takes a string and a boolean and generates a string query parameter for
 * an API call.
 */
export function generateOrderingQueryParams(orderBy, orderAsc) {
    return orderAsc ? orderBy : `-${orderBy}`;
}
