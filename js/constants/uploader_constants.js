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
        default: 25000000000,
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
