'use strict';

import React from 'react';

import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';

import InputTextAreaToggable from './input_textarea_toggable';


let EditionNoteForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return apiUrls.note_edition;
    },

    getFormData() {
        return {
            bitcoin_id: this.getBitcoinIds().join(),
            note: this.refs.personalNote.state.value
        };
    },

    renderForm() {

        return (
            <form id="personal_note_content" role="form" key="personal_note_content">
                <InputTextAreaToggable
                    ref="personalNote"
                    className="form-control"
                    defaultValue={this.props.editions[0].public_note}
                    rows={3}
                    editable={this.props.editable}
                    required=""
                    onSubmit={this.submit}
                />
            </form>
        );
    }
});

export default EditionNoteForm;