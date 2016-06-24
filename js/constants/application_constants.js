const apiEndpoint = process.env.API_URL;
const serverUrl = process.env.SERVER_URL;
const appBasePath = process.env.APP_BASE_PATH;

const constants = {
    apiEndpoint,
    appBasePath,
    serverUrl,
    'aclList': ['acl_coa', 'acl_consign', 'acl_delete', 'acl_download', 'acl_edit', 'acl_create_editions', 'acl_view_editions',
                'acl_loan', 'acl_loan_request', 'acl_share', 'acl_transfer', 'acl_unconsign', 'acl_unshare', 'acl_view',
                'acl_withdraw_transfer', 'acl_wallet_submit'],

    'version': 0.1,
    'subdomains': [
        {
            'subdomain': 'cc',
            'name': 'Creative Commons France',
            'type': 'wallet',
            'ga': 'UA-60614729-4'
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
            'subdomain': 'demo',
            'name': 'Demo',
            'type': 'wallet'
        },
        {
            'subdomain': 'liquidgallery',
            'name': 'Liquid Gallery',
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

    'copyrightAssociations': ['ARS', 'DACS', 'Bildkunst', 'Pictoright', 'SODRAC', 'Copyright Agency/Viscopy', 'SAVA',
        'Bildrecht GmbH', 'SABAM', 'AUTVIS', 'CREAIMAGEN', 'SONECA', 'Copydan', 'EAU', 'Kuvasto', 'GCA', 'HUNGART',
        'IVARO', 'SIAE', 'JASPAR-SPDA', 'AKKA/LAA', 'LATGA-A', 'SOMAAP', 'ARTEGESTION', 'CARIER', 'BONO', 'APSAV',
        'SPA', 'GESTOR', 'VISaRTA', 'RAO', 'LITA', 'DALRO', 'VeGaP', 'BUS', 'ProLitteris', 'AGADU', 'AUTORARTE', 'BUBEDRA', 'BBDA', 'BCDA', 'BURIDA', 'ADAVIS', 'BSDA'],

    'locationThreshold': 10,

    'searchThreshold': 500,

    'encodeUpdateThreshold': 5000,

    'supportedThumbnailFileFormats': [
        'x-sgi-movie', 'x-msvideo', 'quicktime', 'mpeg', 'png', 'jpeg', 'gif',
        'ogg', 'oga', 'ogv', 'ogx', 'wmv', 'wma', 'flv', '3gpp2', '3p2', '3pg',
        'png', 'jpg', 'jpeg', 'gif', '264', '3g', '3g2', '3gp', '3gp2', '3gpp',
        'mp4', 'm4a', 'm4v', 'f4v', 'f4a', 'm4b', 'm4r', 'f4b', 'mov', 'quicktime',
        'webm', 'x264', 'mpeg', 'mpeg4', 'mpg4', 'bmp', 'eps', 'jp2', 'j2k', 'jpm',
        'mj2', 'tif', 'tiff'
    ],

    // in case of whitelabel customization, we store stuff here
    'whitelabel': {},

    // 3rd party integrations
    'jquery': {
        'sdkUrl': 'https://code.jquery.com/jquery-2.1.4.min.js'
    },
    'audiojs': {
        'sdkUrl': `${appBasePath}/static/third_party/audiojs/audio.min.js`
    },
    'videojs': {
        'sdkUrl': '//vjs.zencdn.net/4.12/video.js',
        'cssUrl': '//vjs.zencdn.net/4.12/video-js.css'
    },
    'raven': {
        ignoreErrors: [
            'Authentication credentials were not provided.',
            'Informations d\'authentification non fournies.'
        ],
        url: process.env.RAVEN_DSL_URL
    },
    'facebook': {
        'appId': '420813844732240',
        'sdkUrl': '//connect.facebook.net/en_US/sdk.js'
    },
    'twitter': {
        'sdkUrl': 'https://platform.twitter.com/widgets.js'
    },
    'cloudfrontDomain': 'd1qjsxua1o9x03.cloudfront.net'
};

export default constants;
