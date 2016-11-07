'use strict';

import languages from '../constants/languages';

import { formatText } from './general_utils';


export function getLang() {
    // this is just for testing, as changing the navigator.language wasn't possible
    // return 'fr';
    //return navigator.languages ? navigator.languages[0] :
                                // (navigator.language || navigator.userLanguage);
	var siteLang=getCookie("sitelang");
    if (siteLang != "") {
       return siteLang;
    } else {
       return 'fr';
    }
}

export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


export function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	location.reload();
}

/**
 * Is used to translate strings to another language. Basically can be used with C's string format method.
 * @param  {string}    s        The string you want to translate
 * @param  {array} args         An array of arguments (essentially JavaScript's this.arguments) that can be used to substitute digits and other strings
 * @return {string}             The formated string
 */
export function getLangText(s, ...args) {
    let lang = getLang();
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
