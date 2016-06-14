let URL_MAPPING;

export function resolveUrl(url) {
    let apiUrl = url;

    if (!url) {
        throw new Error('Url was not defined');
    } else if (!url.match(/^http/)) {
        apiUrl = URL_MAPPING && URL_MAPPING[url];

        if (!apiUrl) {
            if (process.env.NODE_ENV === 'production' &&
                !(URL_MAPPING && Object.keys(URL_MAPPING).length)) {
                // eslint-disable-next-line no-console
                console.warn('No url mapping was defined yet for ApiUrlResolver.');
            }

            throw new Error(`Could not find a url mapping for "${url}"`);
        }
    }

    return apiUrl;
}

export function setUrlMapping(urlMapping) {
    URL_MAPPING = urlMapping;
}

export default {
    setUrlMapping,
    resolve: resolveUrl
};
