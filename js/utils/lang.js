import { getBrowserLang } from 'js-utility-belt/es6/lang';

import languages from '../constants/languages';

import { formatText } from './text';


/**
 * Is used to translate strings to another language. Basically can be used with C's string format method.
 * @param  {string} s           The string you want to translate
 * @param  {array}  args        An array of arguments (essentially JavaScript's this.arguments)
 *                              that can be used to substitute digits and other strings
 * @return {string}             The formated string
 */
export function getLangText(s, ...args) {
    const lang = getBrowserLang();
    let str = s;

    try {
        // Default to english if the language isn't found
        const language = languages[lang in languages ? lang : 'en-US'];

        // Default to the original string if no match is found
        str = language[s] || s;
    } catch (err) {
        // TODO: turn the warning back on when our localization is on point
        if (false && process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`Language-string is not in constants file. Add: "${s}" to the "${lang}"` +
                         'language file. Defaulting to keyname');
        }
    }

    return formatText(str, ...args);
}
