'use strict';

let constants = {
    //'baseUrl': 'http://localhost:8000/api/',
    'baseUrl': 'http://staging.ascribe.io/api/',
    'debugCredentialBase64': 'ZGltaUBtYWlsaW5hdG9yLmNvbTowMDAwMDAwMDAw', // dimi@mailinator:0000000000
    'aclList': ['edit', 'consign', 'consign_request', 'unconsign', 'unconsign_request', 'transfer',
        'loan', 'loan_request', 'share', 'download', 'view', 'delete', 'del_from_collection', 'add_to_collection']
};

export default constants;
