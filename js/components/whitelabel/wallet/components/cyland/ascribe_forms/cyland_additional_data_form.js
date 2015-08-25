'use strict';

import React from 'react';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';

import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

import FurtherDetailsFileuploader from '../../../../../ascribe_detail/further_details_fileuploader';

import ApiUrls from '../../../../../../constants/api_urls';
import AppConstants from '../../../../../../constants/application_constants';

import requests from '../../../../../../utils/requests';

import { getLangText } from '../../../../../../utils/lang_utils';

let CylandAdditionalDataForm = React.createClass({
    propTypes: {
        handleSuccess: React.PropTypes.func.isRequired,
        piece: React.PropTypes.object.isRequired,

        disabled: React.PropTypes.bool
    },

    getInitialState() {
        return {
            isUploadReady: true
        };
    },

    getFormData() {
        let extradata = {};
        let formRefs = this.refs.form.refs;

        // Put additional fields in extra data object
        Object
            .keys(formRefs)
            .forEach((fieldName) => {
                extradata[fieldName] = formRefs[fieldName].state.value;
            });

        return {
            extradata: extradata,
            piece_id: this.props.piece.id
        };

    },

    uploadStarted() {
        this.setState({
            isUploadReady: false
        });
    },

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    isReadyForFormSubmission(files) {
        let uploadingFiles = files.filter((file) => file.status === 'submitting');

        if (uploadingFiles.length === 0) {
            return true;
        } else {
            return false;
        }
    },

    render() {
        if(this.props.piece && this.props.piece.id) {
            return (
                <Form
                    disabled={this.props.disabled}
                    className="ascribe-form-bordered"
                    ref='form'
                    url={requests.prepareUrl(ApiUrls.piece_extradata, {piece_id: this.props.piece.id})}
                    handleSuccess={this.props.handleSuccess}
                    getFormData={this.getFormData}
                    buttons={
                        <button
                            type="submit"
                            className="btn ascribe-btn ascribe-btn-login"
                            disabled={!this.state.isUploadReady || this.props.disabled}>
                            {getLangText('Proceed to loan')}
                        </button>
                    }
                    spinner={
                        <div className="modal-footer">
                            <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_small.gif'} />
                        </div>
                    }>
                    <div className="ascribe-form-header">
                        <h3>
                            {getLangText('Provide supporting materials')}
                        </h3>
                    </div>
                    <Property
                        name='artist_bio'
                        label={getLangText('Artist Biography')}
                        editable={!this.props.disabled}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={!this.props.disabled}
                            defaultValue={this.props.piece.extra_data.artist_bio}
                            placeholder={getLangText('Enter the artist\'s biography...')}
                            required="required"/>
                    </Property>
                    <Property
                        name='conceptual_overview'
                        label={getLangText('Conceptual Overview')}
                        editable={!this.props.disabled}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={!this.props.disabled}
                            defaultValue={this.props.piece.extra_data.conceptual_overview}
                            placeholder={getLangText('Enter a conceptual overview...')}
                            required="required"/>
                    </Property>
                    <FurtherDetailsFileuploader
                        uploadStarted={this.uploadStarted}
                        submitKey={this.submitKey}
                        setIsUploadReady={this.setIsUploadReady}
                        isReadyForFormSubmission={this.isReadyForFormSubmission}
                        editable={!this.props.disabled}
                        pieceId={this.props.piece.id}
                        otherData={this.props.piece.other_data}
                        multiple={true}/>
                </Form>
            );
        } else {
            return (
                <div className="ascribe-loading-position">
                    <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
                </div>
            );
        }
    }
});

export default CylandAdditionalDataForm;