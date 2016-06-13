'use strict';
import { getBrowserLang } from 'js-utility-belt/es6/lang';

import languages from '../constants/languages';

import { formatText } from './general';


/**
 * Is used to translate strings to another language. Basically can be used with C's string format method.
 * @param  {string}    s        The string you want to translate
 * @param  {array} args         An array of arguments (essentially JavaScript's this.arguments) that can be used to substitute digits and other strings
 * @return {string}             The formated string
 */
export function getLangText(s, ...args) {
    const lang = getBrowserLang();
    try {
        if(lang in languages) {
            return formatText(languages[lang][s], ...args);
        } else {
            // just use the english language
            return formatText(languages['en-US'][s], ...args);
        }
    } catch(err) {
        //if(!(s in languages[lang])) {
        //console.warn('Language-string is not in constants file. Add: "' + s + '" to the "' + lang + '" language file. Defaulting to keyname');
        return formatText(s, ...args);
        //} else {
        //    console.error(err);
        //}
    }
}
