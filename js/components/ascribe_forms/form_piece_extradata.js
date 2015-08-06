'use strict';

import React from 'react';

import requests from '../../utils/requests';
import { getLangText } from '../../utils/lang_utils.js';

import apiUrls from '../../constants/api_urls';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';

let PieceExtraDataForm = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number,
        extraData: React.PropTypes.object,
        handleSuccess: React.PropTypes.func,
        name: React.PropTypes.string,
        title: React.PropTypes.string,
        editable: React.PropTypes.bool
    },

    getFormData() {
        let extradata = {};
        extradata[this.props.name] = this.refs.form.refs[this.props.name].state.value;
        return {
            extradata: extradata,
            piece_id: this.props.pieceId
        };
    },
    
    render() {
        let defaultValue = this.props.extraData[this.props.name] || '';
        if (defaultValue.length === 0 && !this.props.editable){
            return null;
        }
        let url = requests.prepareUrl(apiUrls.piece_extradata, {piece_id: this.props.pieceId});
        return (
            <Form
                ref='form'
                url={url}
                handleSuccess={this.props.handleSuccess}
                getFormData={this.getFormData}>
                <Property
                    name={this.props.name}
                    label={this.props.title}
                    editable={this.props.editable}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={this.props.editable}
                        defaultValue={defaultValue}
                        placeholder={getLangText('Fill in%s', ' ') + this.props.title}
                        required="required"/>
                </Property>
                <hr />
            </Form>
        );
    }
});


export default PieceExtraDataForm;
