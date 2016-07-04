'use strict';

import request from '../utils/request';

let S3Fetcher = {
    /**
     * Fetch the registered applications of a user from the API.
     */
    deleteFile(key, bucket) {
        return request('delete_s3_file', {
            method: 'DELETE',
            query: { bucket, key }
        });
    },

    signUrl(key, title, artistName) {
        return request('sign_url_s3', {
            query: { artistName, key, title }
        });
    }
};

export default S3Fetcher;
