'use strict';

import React from 'react';

import requests from '../../utils/requests';

import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';

import InputTextAreaToggable from './input_textarea_toggable';


let PieceExtraDataForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return requests.prepareUrl(apiUrls.piece_extradata, {piece_id: this.props.editions[0].bitcoin_id});
    },

    getFormData() {
        let extradata = {};
        extradata[this.props.name] = this.refs[this.props.name].state.value;
        return {
            bitcoin_id: this.getBitcoinIds().join(),
            extradata: extradata
        };
    },

    renderForm() {
        let defaultValue = this.props.editions[0].extra_data[this.props.name] || '';
        if (defaultValue.length === 0 && ~this.props.editable){
            return null;
        }
        return (
            <form role="form" key={this.props.name}>
                <h5>{this.props.title}</h5>
                <InputTextAreaToggable
                    ref={this.props.name}
                    className="form-control"
                    defaultValue={defaultValue}
                    rows={3}
                    editable={this.props.editable}
                    required=""
                    onSubmit={this.submit}
                />
            </form>
        );
    }
});

export default PieceExtraDataForm;
