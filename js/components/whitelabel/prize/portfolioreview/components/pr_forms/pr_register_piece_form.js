'use strict';

import React from 'react';
import { History } from 'react-router';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';
import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

import UploadButton from '../../../../../ascribe_uploader/ascribe_upload_button/upload_button';
import InputFineuploader from '../../../../../ascribe_forms/input_fineuploader';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import AppConstants from '../../../../../../constants/application_constants';
import ApiUrls from '../../../../../../constants/api_urls';

import requests from '../../../../../../utils/requests';

import { getLangText } from '../../../../../../utils/lang_utils';
import { setCookie } from '../../../../../../utils/fetch_api_utils';
import { formSubmissionValidation } from '../../../../../ascribe_uploader/react_s3_fine_uploader_utils';


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
            digitalWorkKeyReady: false,
            thumbnailKeyReady: false,

            // we set this to true, as it is not required
            supportingMaterialsReady: true,
            proofOfPaymentReady: false,
            piece: null
        };
    },

    /**
     * In this method, we're composing all fields on the page
     * in two steps, first submitting the registration of the piece and
     * second adding all the additional details
     */
    submit() {
        if(!this.validateForms()) {
            return;
        } else {
            this.setState({
                digitalWorkKeyReady: false,
                thumbnailKeyReady: false,
                supportingMaterialsReady: false,
                proofOfPaymentReady: false
            });
        }

        const { currentUser } = this.props;
        const { registerPieceForm,
                additionalDataForm,
                uploadersForm } = this.refs;
        const { digitalWorkKey,
                thumbnailKey,
                supportingMaterials,
                proofOfPayment } = uploadersForm.refs;
        const additionalDataFormData = additionalDataForm.getFormData();

        // composing data for piece registration
        let registerPieceFormData = registerPieceForm.getFormData();
        registerPieceFormData.digital_work_key = digitalWorkKey.state.value;
        registerPieceFormData.thumbnail_file = thumbnailKey.state.value;
        registerPieceFormData.terms = true;

        // submitting the piece
        requests
            .post(ApiUrls.pieces_list, { body: registerPieceFormData })
            .then(({ success, piece, notification }) => {
                if(success) {
                    this.setState({
                        piece
                    }, () => {
                        supportingMaterials.refs.input.createBlobRoutine();
                        proofOfPayment.refs.input.createBlobRoutine();
                    });

                    setCookie(currentUser.email, piece.id);

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

    validateForms() {
        const { registerPieceForm,
                additionalDataForm,
                uploadersForm } = this.refs;

        const registerPieceFormValidation = registerPieceForm.validate();
        const additionalDataFormValidation = additionalDataForm.validate();
        const uploaderFormValidation = uploadersForm.validate();

        return registerPieceFormValidation && additionalDataFormValidation && uploaderFormValidation;
    },

    getCreateBlobRoutine() {
        const { piece } = this.state;

        if(piece && piece.id) {
            return {
                url: ApiUrls.blob_otherdatas,
                pieceId: piece.id
            };
        } else {
            return null;
        }
    },

    /**
     * This method is overloaded so that we can track the ready-state
     * of each uploader in the component
     * @param {string} uploaderKey Name of the uploader's key to track
     */
    setIsUploadReady(uploaderKey) {
        return (isUploadReady) => {
            this.setState({
                [uploaderKey]: isUploadReady
            });
        };
    },

    render() {
        const { location } = this.props;
        const { digitalWorkKeyReady,
                thumbnailKeyReady,
                supportingMaterialsReady,
                proofOfPaymentReady } = this.state;

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
                    <Property
                        name='contact_information'
                        label={getLangText('Contact information')}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('Enter your contact information (phone / website)')}/>
                    </Property>
                </Form>
                <Form
                    buttons={{}}
                    className="ascribe-form-bordered"
                    ref="uploadersForm">
                    <Property
                        name="digitalWorkKey">
                        <InputFineuploader
                            fileInputElement={UploadButton(<span>{getLangText('Select the PDF with your work')}</span>)}
                            isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                            setIsUploadReady={this.setIsUploadReady('digitalWorkKeyReady')}
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
                            }}
                            required/>
                    </Property>
                    <Property
                        name="thumbnailKey">
                        <InputFineuploader
                            fileInputElement={UploadButton(<span>{getLangText('Featured Cover photo')}</span>)}
                            createBlobRoutine={{
                                url: ApiUrls.blob_thumbnails
                            }}
                            isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                            setIsUploadReady={this.setIsUploadReady('thumbnailKeyReady')}
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
                            }}
                            required/>
                    </Property>
                    <Property
                        name="supportingMaterials">
                        <InputFineuploader
                            fileInputElement={UploadButton(<span>{getLangText('Supporting Materials (Optional)')}</span>)}
                            isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                            setIsUploadReady={this.setIsUploadReady('supportingMaterialsReady')}
                            createBlobRoutine={this.getCreateBlobRoutine()}
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
                                singular: getLangText('Upload supporting material'),
                                plural: getLangText('Upload supporting materials')
                            }}/>
                    </Property>
                    <Property
                        name="proofOfPayment">
                        <InputFineuploader
                            fileInputElement={UploadButton(<span>{getLangText('Proof of payment')}</span>)}
                            isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                            setIsUploadReady={this.setIsUploadReady('proofOfPaymentReady')}
                            createBlobRoutine={this.getCreateBlobRoutine()}
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
                            }}
                            required/>
                    </Property>
                </Form>
                <Form
                    buttons={{}}
                    className="ascribe-form-bordered">
                    <Property
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
                    disabled={!(digitalWorkKeyReady && thumbnailKeyReady && proofOfPaymentReady && supportingMaterialsReady)}
                    onClick={this.submit}>
                    {getLangText('Submit to Portfolio Review')}
                </button>
            </div>
        );
    }
});

export default PRRegisterPieceForm;