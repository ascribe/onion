// Upload types:
//   * HASH: Hash the file before uploading
//   * NORMAL: Upload the file as-is
//   * USE_URL_PARAM: Determine the type to use through the current url's `upload_method` parameter
export const UploadMethods = {
    HASH: 'hash',
    NORMAL: 'normal',
    USE_URL_PARAM: 'use_url_param'
};

// Validation types
export const ValidationParts = {
    allowedExtensions: {
        images: ['png', 'jpg', 'jpeg', 'gif']
    },
    itemLimit: {
        single: 1,
        multiple: 100
    },
    sizeLimit: {
        default: 50000000000,
        thumbnail: 5000000
    }
};

const { itemLimit, sizeLimit } = ValidationParts;

export const ValidationTypes = {
    additionalData: {
        itemLimit: itemLimit.multiple,
        sizeLimit: sizeLimit.default
    },
    registerWork: {
        itemLimit: itemLimit.single,
        sizeLimit: sizeLimit.default
    },
    workThumbnail: {
        itemLimit: itemLimit.single,
        sizeLimit: sizeLimit.thumbnail
    }
};

// Number of manual retries before showing a contact us screen on the uploader.
export const RETRY_ATTEMPT_TO_SHOW_CONTACT_US = 5;

// S3 settings
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
export const S3_ACL = process.env.S3_ACL;
export const S3_BUCKET = process.env.S3_BUCKET;

export default {
    UploadMethods,
    ValidationParts,
    ValidationTypes,
    RETRY_ATTEMPT_TO_SHOW_CONTACT_US,
    S3_ACCESS_KEY,
    S3_ACL,
    S3_BUCKET
};
