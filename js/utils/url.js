// Re-export related utilities from js-utility-belt for easier access
export { getCurrentQueryParams, stringifyAsQueryParam, parseQueryParamStr } from 'js-utility-belt/es6/url';

/**
 * Takes a string and a boolean and generates an string ordering query parameter for API calls.
 *
 * @param  {string} orderBy  Property to order by
 * @param  {bool}   orderAsc Whether the order should be ascending (false makes order descending)
 * @return {string}          Ordering query parameter
 */
export function generateOrderingQueryParams(orderBy, orderAsc) {
    return orderAsc ? orderBy : `-${orderBy}`;
}

/**
 * Extracts the current location's subdomain.
 * If no subdomain is found (for example on a naked domain), the default "www" is just assumed.
 *
 * @return {string} Subdomain (if none found, defaults to "www")
 */
export function getCurrentSubdomain() {
    const tokens = window.location.host.split('.');
    return tokens.length > 2 ? tokens[0] : 'www';
}
