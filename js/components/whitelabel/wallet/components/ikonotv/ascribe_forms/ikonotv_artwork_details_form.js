'use strict';

import React from 'react';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';

import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

//import FurtherDetailsFileuploader from '../../../../../ascribe_detail/further_details_fileuploader';

import ApiUrls from '../../../../../../constants/api_urls';
import AppConstants from '../../../../../../constants/application_constants';

import requests from '../../../../../../utils/requests';

import { getLangText } from '../../../../../../utils/lang_utils';


let IkonotvArtworkDetailsForm = React.createClass({
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
                            {getLangText('Artwork Details')}
                        </h3>
                    </div>
                    <Property
                        name='medium'
                        label={getLangText('Medium')}
                        editable={!this.props.disabled}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={!this.props.disabled}
                            defaultValue={this.props.piece.extra_data.medium}
                            placeholder={getLangText('The medium of the file (i.e. photo, video, other, ...)')}/>
                    </Property>
                    <Property
                        name='size_duration'
                        label={getLangText('Size/Duration')}
                        editable={!this.props.disabled}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={!this.props.disabled}
                            defaultValue={this.props.piece.extra_data.size_duration}
                            placeholder={getLangText('The size of the file in MB or the duration of the movie')}/>
                    </Property>
                    <Property
                        name='copyright'
                        label={getLangText('Copyright')}
                        editable={!this.props.disabled}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={!this.props.disabled}
                            defaultValue={this.props.piece.extra_data.copyright}
                            placeholder={getLangText('Which copyright is attached to this work?')}/>
                    </Property>
                    <Property
                        name='courtesy_of'
                        label={getLangText('Courtesy of')}
                        editable={!this.props.disabled}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={!this.props.disabled}
                            defaultValue={this.props.piece.extra_data.courtesy_of}
                            placeholder={getLangText('The current owner of the artwork')}/>
                    </Property>
                    <Property
                        name='copyright_of_photography'
                        label={getLangText('Copyright of Photography')}
                        editable={!this.props.disabled}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={!this.props.disabled}
                            defaultValue={this.props.piece.extra_data.copyright_of_photography}
                            placeholder={getLangText('Who should be attributed for the photography?')}/>
                    </Property>
                    <Property
                        name='additional_details'
                        label={getLangText('Additional Details about the artwork')}
                        editable={!this.props.disabled}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={!this.props.disabled}
                            defaultValue={this.props.piece.extra_data.additional_details}
                            placeholder={getLangText('Insert artwork overview')}/>
                    </Property>
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

export default IkonotvArtworkDetailsForm;