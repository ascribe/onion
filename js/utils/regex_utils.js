'use strict'

export function isEmail(string) {
    // This is a bit of a weak test for an email, but you really can't win them all
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address
    return !!string && string.match(/.*@.*\..*/);
}
