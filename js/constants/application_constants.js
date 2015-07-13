'use strict';

let constants = {
    //'baseUrl': 'http://localhost:8000/api/',

    //FIXME: referring to a global variable in `window` is not
    //       super pro. What if we render stuff on the server?
    //'baseUrl': window.BASE_URL,
    'apiEndpoint': window.API_ENDPOINT,
    'serverUrl': window.SERVER_URL,
    'baseUrl': window.BASE_URL,
    'aclList': ['acl_coa', 'acl_consign', 'acl_delete', 'acl_download', 'acl_edit', 'acl_editions', 'acl_loan', 'acl_share', 'acl_transfer', 'acl_unconsign', 'acl_unshare', 'acl_view', 'acl_withdraw_transfer'],

    // in case of whitelabel cusomization, we store stuff here
    'whitelabel': {}
};

export default constants;