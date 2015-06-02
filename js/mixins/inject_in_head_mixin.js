let mapAttr = {
    link: 'href',
    source: 'src'
}

let mapExt = {
    js: 'source',
    css: 'link'
}


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

    injectTag(tag, src){
        console.log(this.foobar);
        if (InjectInHeadMixin.isPresent(tag, src))
            return;

        let attr = mapAttr[tag];
        let element = document.createElement(tag);
        document.head.appendChild(element);
        element[attr] = src;
    },

    injectStylesheet(src) {
        this.injectTag('link', src);
    },

    injectScript(src) {
        this.injectTag('source', src);
    },

    inject(src) {
        let ext = src.split('.').pop();
        let tag = null;
        try {
            tag = mapAttr(src);
        } catch (e) {
            throw new Error(`Cannot inject ${src} in the DOM, cannot guess the tag name from extension "${ext}". Valid extensions are "js" and "css".`);
        }
        InjectInHeadMixin.injectTag(tag, src);
    }

};

export default InjectInHeadMixin;
