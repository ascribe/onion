'use strict';

import React from 'react';

import requests from '../../utils/requests';
import { getLangText } from '../../utils/lang_utils.js'

import apiUrls from '../../constants/api_urls';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';

let PieceExtraDataForm = React.createClass({
    propTypes: {
        edition: React.PropTypes.object,
        handleSuccess: React.PropTypes.func,
        name: React.PropTypes.string,
        title: React.PropTypes.string,
        editable: React.PropTypes.bool
    },
    getFormData(){
        let extradata = {};
        extradata[this.props.name] = this.refs.form.refs[this.props.name].state.value;
        return {
            bitcoin_id: this.props.edition.bitcoin_id,
            extradata: extradata
        };
    },
    render() {
        let defaultValue = this.props.edition.extra_data[this.props.name] || '';
        if (defaultValue.length === 0 && !this.props.editable){
            return null;
        }
        let url = requests.prepareUrl(apiUrls.piece_extradata, {piece_id: this.props.edition.bitcoin_id});
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
                        rows={3}
                        editable={this.props.editable}
                        defaultValue={defaultValue}
                        placeholder={getLangText('Fill in%s', ' ') + this.props.title}
                        required/>
                </Property>
                <Property hidden={true} name='bitcoin_id'>
                    <input defaultValue={this.props.edition.bitcoin_id}/>
                </Property>
                <hr />
            </Form>
        );
    }
});


export default PieceExtraDataForm;
