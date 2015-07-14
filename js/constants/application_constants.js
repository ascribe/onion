'use strict';

let constants = {
    //'baseUrl': 'http://localhost:8000/api/',

    //FIXME: referring to a global variable in `window` is not
    // super pro. What if we render stuff on the server?
    //      - super-bro - Senor Developer, 14th July 2015
    //'baseUrl': window.BASE_URL,
    'apiEndpoint': window.API_ENDPOINT,
    'serverUrl': window.SERVER_URL,
    'baseUrl': window.BASE_URL,
    'aclList': ['acl_coa', 'acl_consign', 'acl_delete', 'acl_download', 'acl_edit', 'acl_editions', 'acl_loan', 'acl_share', 'acl_transfer', 'acl_unconsign', 'acl_unshare', 'acl_view', 'acl_withdraw_transfer'],

    'subdomains': [
        {
            'fields': {
                'user': 22,
                'subdomain': 'cc',
                'name': 'Creative Commons France',
                'logo': 'https://s3-us-west-2.amazonaws.com/ascribe0/public/creativecommons/cc.logo.sm.png',
                'permissions': ['register', 'edit', 'share', 'del_from_collection']
            },
            'model': 'whitelabel.whitelabelsettings',
            'pk': 1
        },
        {
            'fields': {
                'user': 22,
                'subdomain': 'cc-staging',
                'name': 'Creative Commons France',
                'logo': 'https://s3-us-west-2.amazonaws.com/ascribe0/public/creativecommons/cc.logo.sm.png',
                'permissions': ['register', 'edit', 'share', 'del_from_collection']
            },
            'model': 'whitelabel.whitelabelsettings',
            'pk': 2
        },
            {
            'fields': {
                'user': 1,
                'subdomain': 'sluice',
                'name': 'Sluice Art Fair',
                'logo': 'https://s3-us-west-2.amazonaws.com/ascribe0/whitelabel/sluice/logo.jpeg',
                'permissions': ['register', 'edit', 'share', 'del_from_collection']
            },
            'model': 'whitelabel.whitelabelsettings',
            'pk': 3
        },
        {
            'fields': {
                'user': 1,
                'subdomain': 'sluice-staging',
                'name': 'Sluice Art Fair',
                'logo': 'https://s3-us-west-2.amazonaws.com/ascribe0/whitelabel/sluice/logo.jpeg',
                'permissions': ['register', 'edit', 'share', 'del_from_collection']
            },
            'model': 'whitelabel.whitelabelsettings',
            'pk': 4
        }
    ],

    // in case of whitelabel customization, we store stuff here
    'whitelabel': {}
};

export default constants;