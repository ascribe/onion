'use strict';

let mapAttr = {
    link: 'href',
    source: 'src'
};

let mapTag = {
    js: 'script',
    css: 'link'
};


let InjectInHeadMixin = {
    /**
     * Provide functions to inject `<script>` and `<link>` in `<head>`.
     * Useful when you have to load a huge external library and
     * you don't want to embed everything inside the build file.
     */

    isPresent(tag, src) {
        let attr = mapAttr[tag];
        let query = `head > ${tag}[${attr}="${src}"]`;
        return document.querySelector(query);
    },

    injectTag(tag, src, extraAttrs) {
        let promise = new Promise((resolve, reject) => {
            if (InjectInHeadMixin.isPresent(tag, src)) {
                resolve();
            } else {
                let attr = mapAttr[tag];
                let element = document.createElement(tag);
                if (tag == 'script') {
                    element.onload = () => resolve();
                    element.onerror = () => reject();
                } else {
                    resolve();
                }
                document.head.appendChild(element);
                element[attr] = src;
                if (tag == 'link') {
                    element['rel'] = 'stylesheet';
                }
            }
        });

        return promise;
    },

    injectStylesheet(src) {
        return InjectInHeadMixin.injectTag('link', src);
    },

    injectScript(src) {
        return InjectInHeadMixin.injectTag('source', src);
    },

    inject(src) {
        let ext = src.split('.').pop();
        let tag = mapTag[ext];
        if (!tag) {
            throw new Error(`Cannot inject ${src} in the DOM, cannot guess the tag name from extension "${ext}". Valid extensions are "js" and "css".`);
        }

        return InjectInHeadMixin.injectTag(tag, src);
    }

};

export default InjectInHeadMixin;
