'use strict';

import React from 'react';
import { History } from 'react-router';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';
import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

import UploadFileButton from '../../../../../ascribe_buttons/upload_file_button';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import AppConstants from '../../../../../../constants/application_constants';
import ApiUrls from '../../../../../../constants/api_urls';

import requests from '../../../../../../utils/requests';

import { getLangText } from '../../../../../../utils/lang_utils';
import { setCookie } from '../../../../../../utils/fetch_api_utils';


const { object } = React.PropTypes;

const PRRegisterPieceForm = React.createClass({
    propTypes: {
        location: object,
        history: object,
        currentUser: object
    },

    mixins: [History],

    getInitialState(){
        return {
            isUploadReady: false,
            piece: null
        };
    },

    /**
     * In this method, we're composing all fields on the page
     * in two steps, first submitting the registration of the piece and
     * second adding all the additional details
     */
    submit() {
        const { currentUser } = this.props;
        const { registerPieceForm,
                digitalWorkForm,
                proofOfPaymentForm,
                supportingMaterialsForm,
                additionalDataForm,
                thumbnailForm } = this.refs;
        const additionalDataFormData = additionalDataForm.getFormData();

        // composing data for piece registration
        let registerPieceFormData = registerPieceForm.getFormData();
        registerPieceFormData.digital_work_key = digitalWorkForm.state.file ? digitalWorkForm.state.file.key : '';
        registerPieceFormData.terms = true;

        // submitting the piece
        requests
            .post(ApiUrls.pieces_list, { body: registerPieceFormData })
            .then(({ success, piece, notification }) => {
                if(success) {
                    this.setState({
                        piece
                    }, () => {
                        supportingMaterialsForm.createBlobRoutine();
                        proofOfPaymentForm.createBlobRoutine();
                        thumbnailForm.createBlobRoutine();
                    });

                    //setCookie(currentUser.email, piece.id);

                    return requests.post(ApiUrls.piece_extradata, {
                        body: {
                            extradata: additionalDataFormData,
                            piece_id: piece.id
                        },
                        piece_id: piece.id
                    });
                } else {
                    const notificationMessage = new GlobalNotificationModel(notification, 'danger', 5000);
                    GlobalNotificationActions.appendGlobalNotification(notificationMessage);
                }
            })
            .then(() => this.history.pushState(null, `/pieces/${this.state.piece.id}`))
            .catch((err) => {
                console.log(err);
            });

    },

    getCreateBlobRoutine(fileClass) {
        const { piece } = this.state;

        if(piece && piece.id) {
            if(fileClass === 'other_data') {
                return {
                    url: ApiUrls.blob_otherdatas,
                    pieceId: piece.id
                };
            } else if(fileClass === 'thumbnail') {
                return {
                    url: ApiUrls.blob_thumbnails,
                    pieceId: piece.id
                };
            }
        } else {
            return null;
        }
    },

    render() {
        const { location } = this.props;

        return (
            <div className="register-piece--form">
                <Form
                    buttons={{}}
                    className="ascribe-form-bordered"
                    ref="registerPieceForm">
                    <Property
                        name='artist_name'
                        label={getLangText('Full name')}>
                        <input
                            type="text"
                            placeholder="(e.g. Andy Warhol)"
                            required/>
                    </Property>
                    <Property
                        name='title'
                        label={getLangText('Title of the Work')}>
                        <input
                            type="text"
                            placeholder="(e.g. 32 Campbell's Soup Cans)"
                            required/>
                    </Property>
                    <Property
                        name='date_created'
                        label={getLangText('Year of creation')}>
                        <input
                            type="number"
                            placeholder="(e.g. 1962)"
                            min={1}
                            required/>
                    </Property>
                    <Property
                        name='artist_statement'
                        label={getLangText("Artist's statement")}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('Enter your statement')}/>
                    </Property>
                </Form>
                <Form
                    buttons={{}}
                    className="ascribe-form-bordered"
                    ref="additionalDataForm">
                    <Property
                        name='artist_bio'
                        label={getLangText('Biography')}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('Enter your biography')}/>
                    </Property>
                    <Property
                        name='exhibition'
                        label={getLangText('Exhibition / Publication history (optional)')}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('Enter exhibitions and publication history')}/>
                    </Property>
                </Form>
                <div className="input-upload-file-button-property">
                    {getLangText('Select the PDF with your work')}
                    <UploadFileButton
                        ref="digitalWorkForm"
                        createBlobRoutine={{
                            url: ApiUrls.blob_digitalworks
                        }}
                        keyRoutine={{
                            url: AppConstants.serverUrl + 's3/key/',
                            fileClass: 'digitalwork'
                        }}
                        validation={{
                            itemLimit: AppConstants.fineUploader.validation.registerWork.itemLimit,
                            sizeLimit: AppConstants.fineUploader.validation.additionalData.sizeLimit,
                            allowedExtensions: ['pdf']
                        }}
                        location={location}
                        fileClassToUpload={{
                            singular: getLangText('Upload the Portfolio'),
                            plural: getLangText('Upload the Portfolios')
                        }}/>
                </div>
                <div className="input-upload-file-button-property">
                    {getLangText('Featured Cover photo')}
                    <UploadFileButton
                        ref="thumbnailForm"
                        createBlobRoutine={this.getCreateBlobRoutine('thumbnail')}
                        keyRoutine={{
                            url: AppConstants.serverUrl + 's3/key/',
                            fileClass: 'thumbnail'
                        }}
                        validation={{
                            itemLimit: AppConstants.fineUploader.validation.registerWork.itemLimit,
                            sizeLimit: AppConstants.fineUploader.validation.additionalData.sizeLimit,
                            allowedExtensions: ['png', 'jpg']
                        }}
                        location={location}
                        fileClassToUpload={{
                            singular: getLangText('Upload cover photo'),
                            plural: getLangText('Upload cover photos')
                        }}/>
                </div>
                <div className="input-upload-file-button-property">
                    {getLangText('Supporting Materials (Optional)')}
                    <UploadFileButton
                        ref="supportingMaterialsForm"
                        createBlobRoutine={this.getCreateBlobRoutine('other_data')}
                        keyRoutine={{
                            url: AppConstants.serverUrl + 's3/key/',
                            fileClass: 'other_data'
                        }}
                        validation={{
                            itemLimit: AppConstants.fineUploader.validation.registerWork.itemLimit,
                            sizeLimit: AppConstants.fineUploader.validation.additionalData.sizeLimit
                        }}
                        location={location}
                        fileClassToUpload={{
                            singular: getLangText('Upload'),
                            plural: getLangText('Upload')
                        }}/>
                </div>
                <div className="input-upload-file-button-property">
                    {getLangText('Proof of payment')}
                    <UploadFileButton
                        ref="proofOfPaymentForm"
                        createBlobRoutine={this.getCreateBlobRoutine('other_data')}
                        keyRoutine={{
                            url: AppConstants.serverUrl + 's3/key/',
                            fileClass: 'other_data'
                        }}
                        validation={{
                            itemLimit: AppConstants.fineUploader.validation.registerWork.itemLimit,
                            sizeLimit: AppConstants.fineUploader.validation.additionalData.sizeLimit,
                            allowedExtensions: ['png', 'jpg']
                        }}
                        location={location}
                        fileClassToUpload={{
                            singular: getLangText('Upload Screenshot'),
                            plural: getLangText('Upload Screenshots')
                        }}/>
                </div>
                <Form
                    buttons={{}}
                    className="ascribe-form-bordered">
                    <Property
                        ref="termsForm"
                        name="terms"
                        className="ascribe-property-collapsible-toggle"
                        style={{paddingBottom: 0}}>
                        <span>
                            <input type="checkbox" value="true" />
                            {getLangText('By submitting this form, you agree to the Terms of Service of Portfolio Review.')}
                        </span>
                    </Property>
                </Form>
                <button
                    type="submit"
                    className="btn btn-default btn-wide"
                    onClick={this.submit}>
                    {getLangText('Submit to Portfolio Review')}
                </button>
            </div>
        );
    }
});

export default PRRegisterPieceForm;