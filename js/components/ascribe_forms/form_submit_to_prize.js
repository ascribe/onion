'use strict';

import React from 'react';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';
import InputCheckbox from './input_checkbox';

import Alert from 'react-bootstrap/lib/Alert';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import { getLangText } from '../../utils/lang_utils.js';

import requests from '../../utils/requests';

let PieceSubmitToPrizeForm = React.createClass({
    propTypes: {
        piece: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },

    render() {
        return (
            <Form
                ref='form'
                url={requests.prepareUrl(ApiUrls.piece_submit_to_prize, {piece_id: this.props.piece.id})}
                handleSuccess={this.props.handleSuccess}
                buttonSubmit={getLangText('SUBMIT TO PRIZE')}>
                <Property
                    name='artist_statement'
                    label={getLangText('Artist statement')}
                    editable={true}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        placeholder={getLangText('Enter your statement')}
                        required="required"/>
                </Property>
                <Property
                    name='work_description'
                    label={getLangText('Work description')}
                    editable={true}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        placeholder={getLangText('Enter the description for your work')}
                        required="required"/>
                </Property>
                <Property
                    name="terms"
                    className="ascribe-settings-property-collapsible-toggle"
                    style={{paddingBottom: 0}}>
                    <InputCheckbox>
                        <span>
                            {' ' + getLangText('I agree to the Terms of Service the art price') + ' '}
                            (<a href="https://s3-us-west-2.amazonaws.com/ascribe0/whitelabel/sluice/terms.pdf" target="_blank" style={{fontSize: '0.9em', color: 'rgba(0,0,0,0.7)'}}>
                                {getLangText('read')}
                            </a>)
                        </span>
                    </InputCheckbox>
                </Property>
                <Alert bsStyle='warning'>
                    <p>{getLangText('Are you sure you want to submit to the prize?')}</p>
                    <p>{getLangText('This is an irrevocable action%s', '.')}</p>
                </Alert>
            </Form>
        );
    }
});


export default PieceSubmitToPrizeForm;
