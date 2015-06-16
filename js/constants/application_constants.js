'use strict';

let constants = {
    //'baseUrl': 'http://localhost:8000/api/',

    //FIXME: referring to a global variable in `window` is not
    //       super pro. What if we render stuff on the server?
    'baseUrl': window.BASE_URL,
    'apiEndpoint': window.API_ENDPOINT,
    'debugCredentialBase64': 'ZGltaUBtYWlsaW5hdG9yLmNvbTowMDAwMDAwMDAw', // dimi@mailinator:0000000000
    'aclList': ['edit', 'consign', 'consign_request', 'unconsign', 'unconsign_request', 'transfer',
        'loan', 'loan_request', 'share', 'download', 'view', 'delete', 'del_from_collection', 'add_to_collection']
};

export default constants;
