'use strict';

export const validationParts = {
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

const { allowedExtensions, itemLimit, sizeLimit } = validationParts;

export const validationTypes = {
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
