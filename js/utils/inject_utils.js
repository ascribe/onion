'use strict';

import Q from 'q';

let mapAttr = {
    link: 'href',
    script: 'src'
};

let mapTag = {
    js: 'script',
    css: 'link'
};

function injectTag(tag, src) {
    return Q.Promise((resolve, reject) => {
        if (isPresent(tag, src)) {
            resolve();
        } else {
            let attr = mapAttr[tag];
            let element = document.createElement(tag);
            if (tag === 'script') {
                element.onload = () => resolve();
                element.onerror = () => reject();
            } else {
                resolve();
            }
            document.head.appendChild(element);
            element[attr] = src;
            if (tag === 'link') {
                element.rel = 'stylesheet';
            }
        }
    });
}

function isPresent(tag, src) {
    let attr = mapAttr[tag];
    let query = `head > ${tag}[${attr}="${src}"]`;
    return document.querySelector(query);
}

function injectStylesheet(src) {
    return injectTag('link', src);
}

function injectScript(src) {
    return injectTag('source', src);
}

function inject(src) {
    let ext = src.split('.').pop();
    let tag = mapTag[ext];
    if (!tag) {
        throw new Error(`Cannot inject ${src} in the DOM, cannot guess the tag name from extension "${ext}". Valid extensions are "js" and "css".`);
    }

    return injectTag(tag, src);
}

export const InjectInHeadUtils = {
    /**
     * Provide functions to inject `<script>` and `<link>` in `<head>`.
     * Useful when you have to load a huge external library and
     * you don't want to embed everything inside the build file.
     */

    isPresent,
    injectStylesheet,
    injectScript,
    inject
};
