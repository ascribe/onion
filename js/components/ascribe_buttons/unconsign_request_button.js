'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';

import ModalWrapper from '../ascribe_modal/modal_wrapper';
import UnConsignRequestForm from './../ascribe_forms/form_unconsign_request';

import { getLangText } from '../../utils/lang_utils.js';
import ApiUrls from '../../constants/api_urls';


let UnConsignRequestButton = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        edition: React.PropTypes.object.isRequired,
        handleSuccess: React.PropTypes.func.isRequired
    },

    render: function () {
        return (
            <ModalWrapper
                trigger={
                    <Button bsStyle="danger" className="btn-delete pull-center" bsSize="small" type="submit">
                        REQUEST UNCONSIGN
                    </Button>
                }
                handleSuccess={this.props.handleSuccess}
                title='Request to Un-Consign'>
                <UnConsignRequestForm
                    url={ApiUrls.ownership_unconsigns_request}
                    id={{'bitcoin_id': this.props.edition.bitcoin_id}}
                    message={`${getLangText('Hi')},

${getLangText('I request you to un-consign')} \" ${this.props.edition.title} \".

${getLangText('Truly yours')},
${this.props.currentUser.username}`}/>
            </ModalWrapper>
        );
    }
});

export default UnConsignRequestButton;

