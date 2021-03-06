'use strict';

import { getLangText } from './lang_utils';

import GlobalNotificationActions from '../actions/global_notification_actions';
import GlobalNotificationModel from '../models/global_notification_model';

import AppConstants from '../constants/application_constants';

/**
 * Validates a given list of forms
 * @param  {Form} forms                      List of forms, each of which should have a `validate` method available
 * @param  {boolean} showFailureNotification Show global notification if there are validation failures
 * @return {boolean}                         True if validation did *NOT* catch any errors
 */
export function validateForms(forms, showFailureNotification) {
    const validationSuccessful = forms.reduce((result, form) => {
        if (form && typeof form.validate === 'function') {
            return form.validate() && result;
        } else {
            throw new Error('Form given for validation does not have a `validate` method');
        }
    }, true);

    if (!validationSuccessful && showFailureNotification) {
        const notification = new GlobalNotificationModel(getLangText('Oops, there may be missing or invalid fields. Please check your inputs again.'), 'danger');
        GlobalNotificationActions.appendGlobalNotification(notification);
    }

    return validationSuccessful;
}

/**
 * Get the data ids of the given piece or editions.
 * @param  {boolean} isPiece                   Is the given entities parameter a piece? (False: array of editions)
 * @param  {(object|object[])} pieceOrEditions Piece or array of editions
 * @return {(object|object[])}                 Data IDs of the pieceOrEditions for the form
 */
export function getAclFormDataId(isPiece, pieceOrEditions) {
    if (isPiece) {
        return {piece_id: pieceOrEditions.id};
    } else {
        return {bitcoin_id: pieceOrEditions.map(function(edition){
            return edition.bitcoin_id;
        }).join()};
    }
}

/**
 * Generates a message for submitting a form
 * @param  {object} options                     Options object for creating the message:
 * @param  {string} options.aclName             Enum name of an acl
 * @param  {(object|object[])} options.entities Piece or array of Editions
 * @param  {boolean} options.isPiece            Is the given entities parameter a piece? (False: array of editions)
 * @param  {string} [options.senderName]        Name of the sender
 * @return {string}                             Completed message
 */
export function getAclFormMessage(options) {
    if (!options || options.aclName === undefined || options.isPiece === undefined ||
            !(typeof options.entities === 'object' || options.entities.constructor === Array)) {
        throw new Error('You must specify an acl class, entities in the correct format, and entity type');
    }

    let aclName = options.aclName;
    let entityTitles = options.isPiece ? getTitlesStringOfPiece(options.entities)
                                       : getTitlesStringOfEditions(options.entities);
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
    message += entityTitles;

    if(aclName === 'acl_transfer' || aclName === 'acl_loan' || aclName === 'acl_consign') {
        message += getLangText('to you');
    } else if(aclName === 'acl_unconsign' || aclName === 'acl_loan_request') {
        message += getLangText('from you');
    } else if(aclName === 'acl_share') {
        message += getLangText('with you');
    } else {
        throw new Error('Your specified aclName did not match a an acl class.');
    }

    if (options.additionalMessage) {
        message += '\n\n' + options.additionalMessage;
    }

    if (options.senderName) {
        message += '\n\n';
        message += getLangText('Truly yours,');
        message += '\n';
        message += options.senderName;
    }

    return message;
}

function getTitlesStringOfPiece(piece){
    return '\"' + piece.title + '\"';
}

function getTitlesStringOfEditions(editions) {
    return editions.map(function(edition) {
        return '- \"' + edition.title + ', ' + getLangText('edition') + ' ' + edition.edition_number + '\"\n';
    }).join('');
}
