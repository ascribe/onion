'use strict';

//const baseUrl = 'http://localhost:8000/api/';

//FIXME: referring to a global variable in `window` is not
// super pro. What if we render stuff on the server?
//      - super-bro - Senor Developer, 14th July 2015
//const baseUrl = window.BASE_URL;
const apiEndpoint = window.API_ENDPOINT;
const serverUrl = window.SERVER_URL;
const baseUrl = window.BASE_URL;

const constants = {
    apiEndpoint,
    serverUrl,
    baseUrl,
    'aclList': ['acl_coa', 'acl_consign', 'acl_delete', 'acl_download', 'acl_edit', 'acl_create_editions', 'acl_view_editions',
                'acl_loan', 'acl_loan_request', 'acl_share', 'acl_transfer', 'acl_unconsign', 'acl_unshare', 'acl_view',
                'acl_withdraw_transfer', 'acl_wallet_submit'],

    'version': 0.1,
    'csrftoken': 'csrftoken2',
    'subdomains': [
        {
            'subdomain': 'cc',
            'name': 'Creative Commons France',
            'type': 'wallet',
            'ga': 'UA-60614729-4'
        },
        {
            'subdomain': 'sluice',
            'name': 'Sluice Art Fair',
            'type': 'prize',
            'ga': 'UA-60614729-5'
        },
        {
            'subdomain': 'cyland',
            'name': 'Cyland media art lab',
            'type': 'wallet'
        },
        {
            'subdomain': 'ikonotv',
            'name': 'IkonoTV',
            'type': 'wallet'
        },
        {
            'subdomain': 'lumenus',
            'name': 'Lumenus',
            'type': 'wallet'
        },
        {
            'subdomain': '23vivi',
            'name': '23VIVI',
            'type': 'wallet'
        },
        {
            'subdomain': 'polline',
            'name': 'Polline Art',
            'type': 'wallet'
        },
        {
            'subdomain': 'artcity',
            'name': 'Artcity',
            'type': 'wallet'
        },
        {
            'subdomain': 'portfolioreview',
            'name': 'Portfolio Review',
            'type': 'prize'
        }
    ],
    'defaultDomain': {
        'type': 'default',
        'ga': 'UA-60614729-2'
    },

    // These are all possible types that are currently supported in HTML5 for the input element
    // Source: http://www.w3schools.com/tags/att_input_type.asp
    'possibleInputTypes': ['button', 'checkbox', 'color', 'date', 'datetime', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'],

    'copyrightAssociations': ['ARS', 'DACS', 'Bildkunst', 'Pictoright', 'SODRAC', 'Copyright Agency/Viscopy', 'SAVA',
        'Bildrecht GmbH', 'SABAM', 'AUTVIS', 'CREAIMAGEN', 'SONECA', 'Copydan', 'EAU', 'Kuvasto', 'GCA', 'HUNGART',
        'IVARO', 'SIAE', 'JASPAR-SPDA', 'AKKA/LAA', 'LATGA-A', 'SOMAAP', 'ARTEGESTION', 'CARIER', 'BONO', 'APSAV',
        'SPA', 'GESTOR', 'VISaRTA', 'RAO', 'LITA', 'DALRO', 'VeGaP', 'BUS', 'ProLitteris', 'AGADU', 'AUTORARTE', 'BUBEDRA', 'BBDA', 'BCDA', 'BURIDA', 'ADAVIS', 'BSDA'],

    'locationThreshold': 10,

    'searchThreshold': 500,

    'supportedThumbnailFileFormats': [
        'x-sgi-movie', 'x-msvideo', 'quicktime', 'mpeg', 'png', 'jpeg', 'gif',
        'ogg', 'oga', 'ogv', 'ogx', 'wmv', 'wma', 'flv', '3gpp2', '3p2', '3pg',
        'png', 'jpg', 'jpeg', 'gif', '264', '3g', '3g2', '3gp', '3gp2', '3gpp',
        'mp4', 'm4a', 'm4v', 'f4v', 'f4a', 'm4b', 'm4r', 'f4b', 'mov', 'quicktime',
        'webm', 'x264', 'mpeg', 'mpeg4', 'mpg4', 'bmp', 'eps', 'jp2', 'j2k', 'jpm',
        'mj2'
    ],

    // in case of whitelabel customization, we store stuff here
    'whitelabel': {},

    // 3rd party integrations
    'jquery': {
        'sdkUrl': 'https://code.jquery.com/jquery-2.1.4.min.js'
    },
    'shmui': {
        'sdkUrl': baseUrl + 'static/thirdparty/shmui/jquery.shmui.js',
        'cssUrl': baseUrl + 'static/thirdparty/shmui/shmui.css'
    },
    'audiojs': {
        'sdkUrl': baseUrl + 'static/thirdparty/audiojs/audiojs/audio.min.js'
    },
    'videojs': {
        'sdkUrl': '//vjs.zencdn.net/4.12/video.js',
        'cssUrl': '//vjs.zencdn.net/4.12/video-js.css'
    },
    'raven': {
        'url': 'https://0955da3388c64ab29bd32c2a429f9ef4@app.getsentry.com/48351'
    },
    'facebook': {
        'appId': '420813844732240',
        'sdkUrl': '//connect.facebook.net/en_US/sdk.js'
    },
    'twitter': {
        'sdkUrl': 'https://platform.twitter.com/widgets.js'
    },

    'errorMessagesToIgnore': [
        'Authentication credentials were not provided.',
        'Informations d\'authentification non fournies.'
    ]
};

export default constants;
