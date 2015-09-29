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
    'aclList': ['acl_coa', 'acl_consign', 'acl_delete', 'acl_download', 'acl_edit', 'acl_create_editions', 'acl_view_editions',
                'acl_loan', 'acl_share', 'acl_transfer', 'acl_unconsign', 'acl_unshare', 'acl_view',
                'acl_withdraw_transfer', 'acl_wallet_submit'],

    'version': 0.1,
    'csrftoken': 'csrftoken2',
    'subdomains': [
        {
            'subdomain': 'cc',
            'name': 'Creative Commons France',
            'logo': 'https://s3-us-west-2.amazonaws.com/ascribe0/public/creativecommons/cc.logo.sm.png',
            'permissions': ['register', 'edit', 'share', 'del_from_collection'],
            'type': 'wallet',
            'ga': 'UA-60614729-4'
        },
        {
            'subdomain': 'sluice',
            'name': 'Sluice Art Fair',
            'logo': 'http://sluice.info/images/logo.gif',
            'permissions': ['register', 'edit', 'share', 'del_from_collection'],
            'type': 'prize',
            'ga': 'UA-60614729-5'
        },
        {
            'subdomain': 'cyland',
            'name': 'Cyland media art lab',
            'logo': 'https://s3-us-west-2.amazonaws.com/ascribe0/whitelabel/cyland/logo.gif',
            'permissions': ['register', 'edit', 'share', 'del_from_collection'],
            'type': 'wallet'
        },
        {
            'subdomain': 'ikonotv',
            'name': 'IkonoTV',
            'logo': 'https://s3-us-west-2.amazonaws.com/ascribe0/whitelabel/ikonotv/ikono-logo-black.png',
            'permissions': ['register', 'edit', 'share', 'del_from_collection'],
            'type': 'wallet'
        }
    ],
    'defaultDomain': {
        'type': 'default',
        'ga': 'UA-60614729-2'
    },

    // These are all possible types that are currently supported in HTML5 for the input element
    // Source: http://www.w3schools.com/tags/att_input_type.asp
    'possibleInputTypes': ['button', 'checkbox', 'color', 'date', 'datetime', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'],

    'fineUploader': {
        'validation': {
            'additionalData': {
                'itemLimit': 100,
                'sizeLimit': '50000000'
            },
            'registerWork': {
                'itemLimit': 1,
                'sizeLimit': '25000000000'
            }
        }
    },

    // in case of whitelabel customization, we store stuff here
    'whitelabel': {},
    'raven': {
        'url': 'https://0955da3388c64ab29bd32c2a429f9ef4@app.getsentry.com/48351'
    },
    'copyrightAssociations': ['ARS', 'DACS', 'Bildkunst', 'Pictoright', 'SODRAC', 'Copyright Agency/Viscopy', 'SAVA',
        'Bildrecht GmbH', 'SABAM', 'AUTVIS', 'CREAIMAGEN', 'SONECA', 'Copydan', 'EAU', 'Kuvasto', 'GCA', 'HUNGART',
        'IVARO', 'SIAE', 'JASPAR-SPDA', 'AKKA/LAA', 'LATGA-A', 'SOMAAP', 'ARTEGESTION', 'CARIER', 'BONO', 'APSAV',
        'SPA', 'GESTOR', 'VISaRTA', 'RAO', 'LITA', 'DALRO', 'VeGaP', 'BUS', 'ProLitteris', 'AGADU', 'AUTORARTE', 'BUBEDRA', 'BBDA', 'BCDA', 'BURIDA', 'ADAVIS', 'BSDA']
};

export default constants;
