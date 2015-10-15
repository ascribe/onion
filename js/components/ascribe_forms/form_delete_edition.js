'use strict';

import React from 'react';

import Form from './form';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';
import AclInformation from '../ascribe_buttons/acl_information';

let EditionDeleteForm = React.createClass({

    propTypes: {
        editions: React.PropTypes.arrayOf(React.PropTypes.object),

        // Propagated by ModalWrapper in most cases
        handleSuccess: React.PropTypes.func
    },

    getBitcoinIds() {
        return this.props.editions.map(function(edition){
            return edition.bitcoin_id;
        });
    },

    // Since this form can be used for either deleting a single edition or multiple
    // we need to call getBitcoinIds to get the value of edition_id
    getFormData() {
        return {
            edition_id: this.getBitcoinIds().join(',')
        };
    },

    render () {
        return (
            <Form
                ref='form'
                url={ApiUrls.edition_delete}
                getFormData={this.getFormData}
                method="delete"
                handleSuccess={this.props.handleSuccess}
                buttons={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <button
                                type="submit"
                                className="btn btn-danger btn-delete btn-sm ascribe-margin-1px"
                                onClick={this.submit}>
                                {getLangText('YES, DELETE')}
                            </button>
                        </p>
                    </div>
                }
                spinner={
                    <div className="modal-footer">
                        <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_small.gif'} />
                    </div>
                }>
                <AclInformation aim={'form'} verbs={['acl_delete']}/>
                <p>{getLangText('Are you sure you would like to permanently delete this edition')}&#63;</p>
                <p>{getLangText('This is an irrevocable action%s', '.')}</p>
            </Form>
        );
    }
});


export default EditionDeleteForm;
