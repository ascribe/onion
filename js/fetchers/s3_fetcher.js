'use strict';

import request from '../utils/request';

let S3Fetcher = {
    /**
     * Fetch the registered applications of a user from the API.
     */
    deleteFile(key, bucket) {
        return request('s3_delete_file', {
            method: 'DELETE',
            query: { bucket, key }
        });
    },

    signUrl(key, title, artistName) {
        return request('s3_sign_url', {
            query: { artistName, key, title }
        });
    }
};

export default S3Fetcher;
