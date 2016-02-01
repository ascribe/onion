'use strict'

// TODO: Create Unittests that test all functions

// We return new regexes everytime as opposed to using a constant regex because
// regexes with the global flag maintain internal iterators that can cause problems:
// http://bjorn.tipling.com/state-and-regular-expressions-in-javascript
// http://www.2ality.com/2013/08/regexp-g.html
export function getEmailRegex() {
    // This is a bit of a weak test for an email, but you really can't win them all
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address
    return /.*@.*\..*/g;
}

export function getLinkRegex() {
    // You really can't win them all with urls too (unless a 500 character regex that adheres
    // to a strict interpretation of urls sounds like fun!)
    // https://mathiasbynens.be/demo/url-regex
    //
    // This was initially based off of the one angular uses for its linky
    // (https://github.com/angular/angular.js/blob/master/src/ngSanitize/filter/linky.js)...
    // but then it evovled into its own thing to support capturing groups for filtering the
    // hostname and other technically valid urls.
    //
    // Capturing groups:
    //   1. URL scheme
    //   2. URL without scheme
    //   3. Host name
    //   4. Path
    //   5. Fragment
    //
    // Passes most tests of https://mathiasbynens.be/demo/url-regex, but provides a few false
    // positives for some tests that are too strict (like `foo.com`). There are a few other
    // false positives, such as `http://www.foo.bar./` but c'mon, that one's not my fault.
    // I'd argue we would want to match that as a link anyway.
    //
    // Note: This also catches emails, as otherwise it would match the `ascribe.io` in `hi@ascribe.io`,
    // producing (what I think is) more surprising behaviour than the alternative.
    return /\b(https?:\/\/)?((?:www\.)?((?:[^\s.,;()\/]+\.)+[^\s$_!*()$&.,;=?+\/\#]+)((?:\/|\?|\/\?)[^\s#^`{}<>?"\[\]\/\|]+)*\/?(#[^\s#%^`{}<>?"\[\]\/\|]*)?)/g;
}

/**
 * @param  {string} string String to check
 * @return {boolean}       Whether string is an email or not
 */
export function isEmail(string) {
    return !!string && string.match(getEmailRegex());
}

/**
 * @param  {string} string String to check
 * @return {boolean}       Whether string is an link or not
 */
export function isLink(string) {
    return !!string && string.match(getLinkRegex());
}
