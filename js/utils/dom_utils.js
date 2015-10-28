'use strict';

/**
 * Set the title in the browser window.
 */
export function setDocumentTitle(title) {
    document.title = title;
}

/**
 * @param  {string} elementType: string, is the type of the element, such as link, meta, etc.
 * @param  {string} elementId id of the element
 * @param  {object} elementAttributes: hash table containing the attributes of the relevant element
 */
function constructHeadElement(elementType, elementId, elementAttributes) {
    let head = (document.head || document.getElementsByTagName('head')[0]);
    let element = document.createElement(elementType);
    let oldElement = document.getElementById(elementId);
    element.setAttribute('id', elementId);
    for (let k in elementAttributes){
        try {
            element.setAttribute(k, elementAttributes[k]);
        }
        catch(e){
            console.warn(e.message);
            continue;
        }
    }
    if (oldElement) {
        head.removeChild(oldElement);
    }
    head.appendChild(element);
}

/**
 * Accepts a dictionary of dictionaries which comprises a part or all of html head part
 * @param  {object} headObject {link : {id1: {rel: ... }}}
 */
export function constructHead(headObject){
    for (let k in headObject){
        let favicons = headObject[k];
        for (let f in favicons){
            constructHeadElement(k, f, favicons[f]);
        }
    }
}