import { getCookie } from './cookie.js';

import { CSRF_COOKIE_NAME, CSRF_CUSTOM_HEADER_NAME } from '../constants/csrf_constants';


export function getCsrfToken() {
    return getCookie(CSRF_COOKIE_NAME);
}

export function makeCsrfHeader(csrfToken = getCsrfToken()) {
    return csrfToken ? {
        [CSRF_CUSTOM_HEADER_NAME]: csrfToken
    } : {};
}
