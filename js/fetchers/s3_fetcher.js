'use strict';

import requests from '../utils/requests';

let S3Fetcher = {
    /**
     * Fetch the registered applications of a user from the API.
     */
    deleteFile(key, bucket) {
        return requests.delete('delete_s3_file', {
            key,
            bucket
        });
    },
    signUrl(key, title, artistName) {
        return requests.get('sign_url_s3', {
            key,
            title,
            'artist_name': artistName
        });
    }
};

export default S3Fetcher;
