'use strict';

import React from 'react';

import fetch from '../../utils/fetch';

import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';

import InputTextAreaToggable from './input_textarea_toggable';


let PieceExtraDataForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return fetch.prepareUrl(apiUrls.piece_extradata, {piece_id: this.props.editions[0].bitcoin_id});
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

        return (
            <form role="form" key={this.props.name}>
                <h5>{this.props.title}</h5>
                <InputTextAreaToggable
                    ref={this.props.name}
                    className="form-control"
                    defaultValue={this.props.editions[0].extra_data[this.props.name]}
                    rows={3}
                    editable={true}
                    required=""
                    onSubmit={this.submit}
                />
            </form>
        );
    }
});

export default PieceExtraDataForm;