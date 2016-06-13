'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';

import ModalWrapper from '../ascribe_modal/modal_wrapper';
import UnConsignRequestForm from '../ascribe_forms/form_unconsign_request';

import withContext from '../context/with_context';
import { currentUserShape } from '../prop_types';

import { getLangText } from '../../utils/lang';
import ApiUrls from '../../constants/api_urls';


const UnConsignRequestButton = React.createClass({
    propTypes: {
        edition: React.PropTypes.object.isRequired,

        handleSuccess: React.PropTypes.func,

        // Injected through HOCs
        currentUser: currentUserShape.isRequired // eslint-disable-line react/sort-prop-types
    },

    render() {
        const { currentUser, edition, handleSuccess } = this.props;
        return (
            <ModalWrapper
                trigger={
                    <Button bsStyle="danger" className="btn-delete pull-center" bsSize="small" type="submit">
                        {getLangText('REQUEST UNCONSIGN')}
                    </Button>
                }
                handleSuccess={handleSuccess}
                title={getLangText('Request to Un-Consign')}>
                <UnConsignRequestForm
                    url={ApiUrls.ownership_unconsigns_request}
                    id={{'bitcoin_id': edition.bitcoin_id}}
                    message={`${getLangText('Hi')},

${getLangText('I request you to un-consign')} \" ${edition.title} \".

${getLangText('Truly yours')},
${currentUser.username}`
                    } />
            </ModalWrapper>
        );
    }
});

export default withContext(UnConsignRequestButton, 'currentUser');
