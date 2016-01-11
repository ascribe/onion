'use strict';

import React from 'react';
import { History } from 'react-router';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';
import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

import UploadButton from '../../../../../ascribe_uploader/ascribe_upload_button/upload_button';
import InputFineuploader from '../../../../../ascribe_forms/input_fineuploader';
import AscribeSpinner from '../../../../../ascribe_spinner';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import AppConstants from '../../../../../../constants/application_constants';
import ApiUrls from '../../../../../../constants/api_urls';

import requests from '../../../../../../utils/requests';

import { getErrorNotificationMessage } from '../../../../../../utils/error_utils';
import { setCookie } from '../../../../../../utils/fetch_api_utils';
import { validateForms } from '../../../../../../utils/form_utils';
import { getLangText } from '../../../../../../utils/lang_utils';
import { formSubmissionValidation } from '../../../../../ascribe_uploader/react_s3_fine_uploader_utils';


const { object } = React.PropTypes;

const PRRegisterPieceForm = React.createClass({
    propTypes: {
        currentUser: object,
        location: object
    },

    mixins: [History],

    getInitialState() {
        return {
            digitalWorkKeyReady: true,
            thumbnailKeyReady: true,

            // we set this to true, as it is not required
            supportingMaterialsReady: true,
            proofOfPaymentReady: true,
            piece: null,
            submitted: false
        };
    },

    /**
     * In this method, we're composing all fields on the page
     * in two steps, first submitting the registration of the piece and
     * second adding all the additional details
     */
    submit() {
        if (!this.validateForms()) {
            return;
        }

        // disable the submission button right after the user
        // clicks on it to avoid double submission
        this.setState({
            submitted: true
        });

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
        const registerPieceFormData = registerPieceForm.getFormData();
        registerPieceFormData.digital_work_key = digitalWorkKey.state.value;
        registerPieceFormData.thumbnail_file = thumbnailKey.state.value;
        registerPieceFormData.terms = true;

        // submitting the piece
        requests
            .post(ApiUrls.pieces_list, { body: registerPieceFormData })
            .then(({ piece, notification }) => {
                this.setState({piece}, () => {
                    supportingMaterials.refs.input.createBlobRoutine();
                    proofOfPayment.refs.input.createBlobRoutine();
                });

                setCookie(currentUser.email, piece.id);

                return requests
                    .post(ApiUrls.piece_extradata, {
                        body: {
                            extradata: additionalDataFormData,
                            piece_id: piece.id
                        },
                        piece_id: piece.id
                    })
                    .then(() => {
                        const notificationMessage = new GlobalNotificationModel(notification || getLangText('You have successfully submitted "%s" to Portfolio Review 2015', piece.title), 'success', 5000);
                        GlobalNotificationActions.appendGlobalNotification(notificationMessage);
                    });
            })
            .then(() => this.history.pushState(null, `/pieces/${this.state.piece.id}`))
            .catch((err) => {
                const errMessage = (getErrorNotificationMessage(err) || getLangText("Oops! We weren't able to send your submission.")) +
                                        getLangText(' Please contact support@ascribe.io');

                const notificationMessage = new GlobalNotificationModel(errMessage, 'danger', 10000);
                GlobalNotificationActions.appendGlobalNotification(notificationMessage);

                console.logGlobal(new Error('Portfolio Review piece registration failed'), err);

                // Reset the submit button
                this.setState({
                    submitted: false
                });
            });
    },

    validateForms() {
        const { registerPieceForm,
                additionalDataForm,
                uploadersForm } = this.refs;

        return validateForms([registerPieceForm, additionalDataForm, uploadersForm], true);
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
     * These two methods are overloaded so that we can track the ready-state
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

    handleOptionalFileValidationFailed(uploaderKey) {
        return () => {
            this.setState({
                [uploaderKey]: true
            });
        };
    },

    getSubmitButton() {
        const { digitalWorkKeyReady,
                thumbnailKeyReady,
                supportingMaterialsReady,
                proofOfPaymentReady,
                submitted } = this.state;

        if(submitted) {
            return (
                <span disabled className="btn btn-default btn-wide btn-spinner">
                    <AscribeSpinner color="dark-blue" size="md" />
                </span>
            );
        } else {
            return (
                <button
                    type="button"
                    className="btn btn-default btn-wide"
                    disabled={!(digitalWorkKeyReady && thumbnailKeyReady && proofOfPaymentReady && supportingMaterialsReady)}
                    onClick={this.submit}>
                    {getLangText('Submit to Portfolio Review')}
                </button>
            );
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
                            placeholder={getLangText('(e.g. Andy Warhol)')}
                            required/>
                    </Property>
                    <Property
                        name='title'
                        label={getLangText('Title of the Work')}>
                        <input
                            type="text"
                            placeholder={getLangText("(e.g. 32 Campbell's Soup Cans)")}
                            required/>
                    </Property>
                    <Property
                        name='date_created'
                        label={getLangText('Year of creation')}>
                        <input
                            type="number"
                            placeholder={getLangText('(e.g. 1962)')}
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
                        name='1-date_of_birth'
                        label={getLangText('Date of Birth')}>
                        <input
                            type="number"
                            placeholder={getLangText('(e.g. 1962)')}
                            min={1900}
                            required/>
                    </Property>
                    <Property
                        name='2-artist_bio'
                        label={getLangText('Biography')}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('Enter your biography')}/>
                    </Property>
                    <Property
                        name='3-exhibition'
                        label={getLangText('Exhibition / Publication history (optional)')}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('Enter exhibitions and publication history')}/>
                    </Property>
                    <Property
                        name='4-phone_number'
                        label={getLangText('Phone Number')}>
                        <input
                            type="tel"
                            placeholder={getLangText('Enter your phone number')}
                            required/>
                    </Property>
                    <Property
                        name='5-email'
                        label={getLangText('Email Address')}>
                        <input
                            type="email"
                            placeholder={getLangText('Enter your email')}
                            required/>
                    </Property>
                    <Property
                        name='6-website'
                        label={getLangText('Website')}>
                        <input
                            type="url"
                            placeholder={getLangText('Enter your website')}
                            required/>
                    </Property>
                </Form>
                <Form
                    buttons={{}}
                    className="ascribe-form-bordered"
                    ref="uploadersForm">
                    <Property
                        name="digitalWorkKey"
                        label={getLangText('Select the PDF with your work')}>
                        <InputFineuploader
                            fileInputElement={UploadButton()}
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
                                singular: getLangText('Select the Portfolio'),
                                plural: getLangText('Select the Portfolios')
                            }}
                            required/>
                    </Property>
                    <Property
                        name="thumbnailKey"
                        label={getLangText('Featured Cover photo (max 5MB)')}>
                        <InputFineuploader
                            fileInputElement={UploadButton()}
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
                                itemLimit: AppConstants.fineUploader.validation.workThumbnail.itemLimit,
                                sizeLimit: AppConstants.fineUploader.validation.workThumbnail.sizeLimit,
                                allowedExtensions: ['png', 'jpg', 'jpeg', 'gif']
                            }}
                            location={location}
                            fileClassToUpload={{
                                singular: getLangText('Select cover photo'),
                                plural: getLangText('Select cover photos')
                            }}
                            required/>
                    </Property>
                    <Property
                        name="supportingMaterials"
                        label={getLangText('Supporting Materials (Optional)')}>
                        <InputFineuploader
                            fileInputElement={UploadButton()}
                            isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                            setIsUploadReady={this.setIsUploadReady('supportingMaterialsReady')}
                            onValidationFailed={this.handleOptionalFileValidationFailed('supportingMaterialsReady')}
                            createBlobRoutine={this.getCreateBlobRoutine()}
                            keyRoutine={{
                                url: AppConstants.serverUrl + 's3/key/',
                                fileClass: 'otherdata'
                            }}
                            validation={{
                                itemLimit: AppConstants.fineUploader.validation.registerWork.itemLimit,
                                sizeLimit: AppConstants.fineUploader.validation.additionalData.sizeLimit
                            }}
                            location={location}
                            fileClassToUpload={{
                                singular: getLangText('Select supporting material'),
                                plural: getLangText('Select supporting materials')
                            }}/>
                    </Property>
                    <Property
                        name="proofOfPayment"
                        label={getLangText('Proof of payment')}>
                        <InputFineuploader
                            fileInputElement={UploadButton()}
                            isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                            setIsUploadReady={this.setIsUploadReady('proofOfPaymentReady')}
                            createBlobRoutine={this.getCreateBlobRoutine()}
                            keyRoutine={{
                                url: AppConstants.serverUrl + 's3/key/',
                                fileClass: 'otherdata'
                            }}
                            validation={{
                                itemLimit: AppConstants.fineUploader.validation.registerWork.itemLimit,
                                sizeLimit: AppConstants.fineUploader.validation.additionalData.sizeLimit,
                                allowedExtensions: ['png', 'jpg', 'jpeg', 'gif']
                            }}
                            location={location}
                            fileClassToUpload={{
                                singular: getLangText('Select Screenshot'),
                                plural: getLangText('Select Screenshots')
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
                            {getLangText('By submitting this form, you agree to the') + ' '}
                            <a
                                href="https://s3-us-west-2.amazonaws.com/ascribe0/whitelabel/portfolioreview/tos-portfolioreview.pdf"
                                target="_blank">
                                {getLangText('Terms of Service')}
                            </a>
                            {' of Portfolio Review.'}
                        </span>
                    </Property>
                </Form>
                {this.getSubmitButton()}
            </div>
        );
    }
});

export default PRRegisterPieceForm;
