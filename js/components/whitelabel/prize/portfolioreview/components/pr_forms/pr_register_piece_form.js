'use strict';

import React from 'react';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';
import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';
import InputCheckbox from '../../../../../ascribe_forms/input_checkbox';

import UploadFileButton from '../../../../../ascribe_buttons/upload_file_button';

import AppConstants from '../../../../../../constants/application_constants';

import { getLangText } from '../../../../../../utils/lang_utils';


const { object } = React.PropTypes;

const PRRegisterPieceForm = React.createClass({
    propTypes: {
        location: object
    },

    getInitialState(){
        return {
            isUploadReady: false
        };
    },

    handleSuccess() {

    },

    render() {
        const { location } = this.props;

        return (
            <div className="register-piece--form">
                <Form
                    className="ascribe-form-bordered"
                    ref="registerPieceFields">
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
                </Form>
                <Form
                    className="ascribe-form-bordered"
                    ref="additionalData">
                    <Property
                        name='biography'
                        label={getLangText('Biography')}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('THIS NEEDS TEXT')}/>
                    </Property>
                    <Property
                        name='artist_statement'
                        label={getLangText("Artist's statement")}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('THIS NEEDS TEXT')}/>
                    </Property>
                    <Property
                        name='exhibition'
                        label={getLangText('Exhibition / Publication history (optional)')}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('THIS NEEDS TEXT')}/>
                    </Property>
                </Form>
                <div className="input-upload-file-button-property">
                    {getLangText('Select the PDF with your work')}
                    <UploadFileButton
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
                            singular: getLangText('Upload Screenshot'),
                            plural: getLangText('Upload Screenshots')
                        }}/>
                </div>
                <Form
                    className="ascribe-form-bordered"
                    ref="terms">
                    <Property
                        name="terms"
                        className="ascribe-property-collapsible-toggle"
                        style={{paddingBottom: 0}}>
                        <InputCheckbox
                            key="terms_explicitly"
                            defaultChecked={false}>
                            &nbsp;{getLangText('I agree to the Terms and Conditions of the Portfolio Review')}
                        </InputCheckbox>
                    </Property>
                </Form>
                <button
                    type="submit"
                    className="btn btn-default btn-wide"
                    disabled={!this.state.isUploadReady}>
                    {getLangText('Submit to Portfolio Review')}
                </button>
            </div>
        );
    }
});

export default PRRegisterPieceForm;