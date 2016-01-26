'use strict';

import React from 'react';

import { getLinkRegex, isEmail } from './regex_utils';

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
    const head = (document.head || document.getElementsByTagName('head')[0]);
    const element = document.createElement(elementType);
    const oldElement = document.getElementById(elementId);

    element.setAttribute('id', elementId);

    for (let k in elementAttributes) {
        try {
            element.setAttribute(k, elementAttributes[k]);
        } catch(e) {
            console.warn(e.message);
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
        const favicons = headObject[k];
        for (let f in favicons){
            constructHeadElement(k, f, favicons[f]);
        }
    }
}

/**
 * Replaces the links and emails in a given string with anchor elements.
 *
 * @param  {string} string          String to anchorize
 * @param  {(object)} options       Options object for anchorizing
 * @param  {(boolean)} emails         Whether or not to replace emails (default: true)
 * @param  {(boolean)} links          Whether or not to replace links (default: true)
 * @param  {(string)} target          Anchor target attribute (default: '_blank')
 * @return {string|React.element[]} Anchorized string as usable react element, either as an array of
 *                                  elements or just a string
 */
export function anchorize(string, { emails: replaceEmail = true, links: replaceLink = true, target = '_blank' } = {}) {
    if (!replaceEmail && !replaceLink) {
        return string;
    }

    const linkRegex = getLinkRegex();
    const strWithAnchorElems = [];
    let lastMatchIndex = 0;
    let regexMatch;

    while (regexMatch = linkRegex.exec(string)) {
        const [ matchedStr, schemeName ] = regexMatch;
        const matchedStrIsEmail = isEmail(matchedStr);

        let anchorizedMatch;
        if (matchedStrIsEmail && replaceEmail) {
            anchorizedMatch = (<a href={`mailto:${matchedStr}`}>{matchedStr}</a>);
        } else if (!matchedStrIsEmail && replaceLink) {
            anchorizedMatch = (<a href={`${schemeName ? matchedStr : ('http://' + matchedStr)}`} target={target}>{matchedStr}</a>);
        }

        // We only need to add an element to the array and update the lastMatchIndex if we actually create an anchor
        if (anchorizedMatch) {
            // First add the string between the end of the last anchor text and the start of the current match
            const currentMatchStartIndex = linkRegex.lastIndex - matchedStr.length;

            if (lastMatchIndex !== currentMatchStartIndex) {
                strWithAnchorElems.push(string.substring(lastMatchIndex, currentMatchStartIndex));
            }

            strWithAnchorElems.push(anchorizedMatch);

            lastMatchIndex = linkRegex.lastIndex;
        }
    }

    if (strWithAnchorElems.length) {
        // Add the string between the end of the last anchor and the end of the string
        if (lastMatchIndex !== string.length) {
            strWithAnchorElems.push(string.substring(lastMatchIndex));
        }

        return strWithAnchorElems;
    } else {
        return string;
    }
}
