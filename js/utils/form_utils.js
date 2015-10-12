'use strict';

import { getLangText } from './lang_utils';

/**
 * Generates a message for submitting a form
 * @param  {string} aclName    Enum name of a acl
 * @param  {string} entities   Already computed name of entities
 * @param  {string} senderName Name of the sender
 * @return {string}            Completed message
 */
export function getAclFormMessage(aclName, entities, senderName) {
    let message = '';

    message += getLangText('Hi');
    message += ',\n\n';

    if(aclName === 'acl_transfer') {
        message += getLangText('I transfer ownership of');
    } else if(aclName === 'acl_consign') {
        message += getLangText('I consign');
    } else if(aclName === 'acl_unconsign') {
        message += getLangText('I un-consign');
    } else if(aclName === 'acl_loan') {
        message += getLangText('I loan');
    } else if(aclName === 'acl_loan_request') {
        message += getLangText('I request to loan');
    } else if(aclName === 'acl_share') {
        message += getLangText('I share');
    } else {
        throw new Error('Your specified aclName did not match a an acl class.');
    }

    message += ':\n';
    message += entities;

    if(aclName === 'acl_transfer' || aclName === 'acl_loan' || aclName === 'acl_consign') {
        message += getLangText('to you');
    } else if(aclName === 'acl_unconsign' || aclName === 'acl_loan_request') {
        message += getLangText('from you');
    } else if(aclName === 'acl_share') {
        message += getLangText('with you');
    } else {
        throw new Error('Your specified aclName did not match a an acl class.');
    }

    message += '\n\n';
    message += getLangText('Truly yours,');
    message += '\n';
    message += senderName;

    return message;
}